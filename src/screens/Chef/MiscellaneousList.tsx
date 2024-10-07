import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import HomeHeader from '../../compoment/HomeHeader';
import {strings} from '../../i18n/i18n';
import NoDataFound from '../../compoment/NoDataFound';
import Spacer from '../../compoment/Spacer';
import ChefNameCardList from '../../compoment/ChefNameCardList';
import DleleteModal from '../../compoment/DeleteModal';
import {screenName} from '../../navigation/screenNames';
import {Icons} from '../../utils/images';
import {getChefsAction} from '../../actions/chefsAction';
import CuisinesNameCardList from '../../compoment/CuisinesNameCardList';
import {
  deleteCuisinesAction,
  deleteMiscellaneousAction,
  getCuisinesAction,
} from '../../actions/cuisinesAction';
import AddFolderModal from '../../compoment/AddFolderModal';
import EditFolderModal from '../../compoment/EditFolderModal';
import Loader from '../../compoment/Loader';
import {getMiscellaneousAction} from '../../actions/menuAction';

type Props = {};

const MiscellaneousList = (props: Props) => {
  const {colors, isDark} = useTheme();
  const navigation = useNavigation();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const {isDarkTheme, isLoadingNew} = useAppSelector(state => state.common);
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {getCuisines, cuisinesCount, getMiscellaneous} = useAppSelector(
    state => state.data,
  );
  const [getAllData, setGetAllData] = useState(getMiscellaneous);
  const [newFolder, setNewFolder] = useState(false);
  const [editFolder, setEditFolder] = useState(false);
  const [selectItem, setSelectItem] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();

  const closeModal = () => {
    setVisible(false);
  };

  const removeMenuCardList = () => {
    let UserInfo = {
      data: selectItem?.id,
      onSuccess: (res: any) => {
        closeModal();
        const updateData = getAllData.filter(item => {
          return item?.id !== selectItem?.id;
        });
        setGetAllData(updateData);
      },
      onFailure: (Err: any) => {},
    };
    dispatch(deleteMiscellaneousAction(UserInfo));
  };

  const onPressDelete = () => {
    setVisible(false);
    removeMenuCardList();
  };

  useEffect(() => {
    getCuisinesList(1);
  }, [newFolder, editFolder, isLoadingNew]);

  const getCuisinesList = (pages: number) => {
    let obj = {
      data: {
        page: pages,
        limit: 100,
        pagination: false,
      },
      onSuccess: (res: any) => {
        setGetAllData(res?.data);
        setLoading(false);
      },
      onFailure: (Err: any) => {
        setLoading(false);
      },
    };
    dispatch(getMiscellaneousAction(obj));
  };

  const onSearchBar = (text: string) => {
    setSearchQuery(text);
    const filteredItems = getMiscellaneous?.filter((f: any) =>
      f?.name?.toLowerCase()?.match(text?.toLowerCase()),
    );
    setGetAllData(filteredItems);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={colors.white}
      />

      <HomeHeader
        onBackPress={() => {
          navigation.goBack();
        }}
        onRightPress={() => {
          navigation.navigate(screenName.AddMiscellaneous);
          // setNewFolder(true)
        }}
        mainShow={true}
        title={strings('miscellaneousList.miscellaneous')}
        extraStyle={styles.headerContainer}
        createText={strings('miscellaneousList.add')}
        isShowIcon={false}
        isCreateIcon={true}
      />
      <View style={{marginHorizontal: wp(20)}}>
        <View style={styles.searchInputContainer}>
          <Image source={Icons.search} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={strings('CuisinesNameList.Search')}
            value={searchQuery}
            onChangeText={text => onSearchBar(text)}
            placeholderTextColor={colors.text_gray1}
          />
        </View>

        {loading ? (
          <Loader size={'small'} />
        ) : (
          <FlatList
            onEndReachedThreshold={0.3}
            data={getAllData}
            ListEmptyComponent={<NoDataFound />}
            ListHeaderComponent={() => {
              return (
                <View style={styles.headerList}>
                  <Text style={styles.nameText}>
                    {strings('CuisinesNameList.names')}
                  </Text>
                  <Text style={styles.nameText}>
                    {strings('miscellaneousList.price')}
                  </Text>
                  <Text style={styles.nameText}>
                    {strings('CuisinesNameList.action')}
                  </Text>
                </View>
              );
            }}
            renderItem={({item, index}) => {
              return (
                <CuisinesNameCardList
                  item={item}
                  onPressEdit={() => {
                    navigation.navigate(screenName.EditMiscellaneous, {
                      data: item,
                    });
                    setSelectItem(item);
                  }}
                  setDelete={() => {
                    setVisible(true);
                    setSelectItem(item);
                  }}
                  isRecipeMaster={true}
                  isShowPrice={true}
                />
              );
            }}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => {
              return <View style={{height: 150}} />;
            }}
          />
        )}
      </View>
      <DleleteModal
        title={strings('myMenuList.are_you_sure')}
        rightText={strings('myMenuList.yes')}
        leftText={strings('myMenuList.no')}
        visible={visible}
        closeModal={() => closeModal()}
        onPressDelete={() => onPressDelete()}
      />
    </View>
  );
};

export default MiscellaneousList;

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg_white,
    },
    headerContainer: {
      backgroundColor: colors.bg_white,
    },
    searchInputContainer: {
      borderRadius: 15,
      backgroundColor: colors.cards_bg,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(14),
    },
    searchInput: {
      flex: 1,
      color: colors.black,
      height: hp(44),
    },
    searchIcon: {
      width: 20,
      height: 20,
      tintColor: colors.border,
    },
    headerList: {
      backgroundColor: colors.cards_bg,
      height: hp(42),
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: wp(16),
      marginTop: hp(16),
      borderRadius: 8,
      flexDirection: 'row',
      marginBottom:hp(32)
    },
    nameText: {
      ...commonFontStyle(500, 16, colors.black),
    },
  });
};
