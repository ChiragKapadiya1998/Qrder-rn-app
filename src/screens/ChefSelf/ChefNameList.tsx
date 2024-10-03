import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import HomeHeader from '../../compoment/HomeHeader';
import { strings } from '../../i18n/i18n';
import NoDataFound from '../../compoment/NoDataFound';
import Spacer from '../../compoment/Spacer';
import ChefNameCardList from '../../compoment/ChefNameCardList';
import DleleteModal from '../../compoment/DeleteModal';
import { screenName } from '../../navigation/screenNames';
import { Icons } from '../../utils/images';
import { deleteChefAction, getChefsAction } from '../../actions/chefsAction';
import Loader from '../../compoment/Loader';

type Props = {};

const ChefNameList = (props: Props) => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const { isDarkTheme } = useAppSelector(state => state.common);
  const { getChefsData } = useAppSelector(state => state.data);
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectItem, setSelectItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [getAllData, setGetAllData] = useState(getChefsData);

  useFocusEffect(
    React.useCallback(() => {
      getChefsList();
    }, []),
  );

  useEffect(() => {
    getChefsList();
  }, [getChefsData?.length]);

  const removeChef = () => {
    let UserInfo = {
      params: selectItem?.id,
      onSuccess: (res: any) => { },
      onFailure: (Err: any) => { },
    };
    dispatch(deleteChefAction(UserInfo));
  };

  const closeModal = () => {
    setVisible(false);
  };
  const onPressDelete = () => {
    setVisible(false);
    removeChef();
  };

  const getChefsList = () => {
    // setLoading(true);
    let obj = {
      data: {
        page: 1,
        limit: 5,
        pagination: false
      },
      onSuccess: (res: any) => {
        setLoading(false);
        setGetAllData(res.data?.data);
      },
      onFailure: (Err: any) => {
        setLoading(false);
      },
    };
    dispatch(getChefsAction(obj));
  };

  const onSearchBar = (text: string) => {
    setSearchQuery(text);
    const filteredItems = getChefsData?.filter((f: any) =>
      f?.name?.toLowerCase()?.match(text?.toLowerCase()),
    );
    setGetAllData(filteredItems);
  };

  const onPressedit = (item) => {
    navigation.navigate(screenName.ChefEditName, { itemData: item })
  };

  const onDeleteChef = (item) => {
    setVisible(true);
    setSelectItem(item);
  }

  const renderItem = ({ item, index }) => {
    const isLastItem = index === getAllData.length - 1;
    return (
      <View style={[styles.boxView]}>
        <View style={styles.subBoxView}>
          <View style={styles.containers}>
            <View style={[styles.leftView, !isLastItem && styles.withBorder]}>
              <View style={[styles.viewStyle, { flex: 1 }]}>
                <Text numberOfLines={1} style={styles.titleText}>
                  {item?.name || item?.menu_name}
                </Text>
              </View>
              <View style={styles.viewStyle}>
                <TouchableOpacity onPress={() => onPressedit(item)}>
                  <Image source={Icons.editItemIcon} style={styles.editIcon} />
                </TouchableOpacity>
                <Spacer width={8} />
                <TouchableOpacity onPress={() => onDeleteChef(item)}>
                  <Image source={Icons.deleteItemIcon} style={styles.editIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }

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
          navigation.navigate(screenName.ChefSignUp);
          // setNewFolder(true)
        }}
        mainShow={true}
        title={strings('ChefNameList.chef_list')}
        extraStyle={styles.headerContainer}
        createText={strings('CuisinesNameList.create')}
        isShowIcon={false}
        isCreateIcon={true}
      />
      <View style={{ marginHorizontal: wp(16) }}>
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
                    {strings('CuisinesNameList.action')}
                  </Text>
                </View>
              );
            }}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => {
              return <View style={{ height: 150 }} />;
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

export default ChefNameList;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
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
    },
    nameText: {
      ...commonFontStyle(500, 16, colors.black),
    },
    boxView: {},
    subBoxView: {
      flexDirection: 'row',
    },
    containers: {
      flex: 1,
    },
    leftView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: hp(12),
      paddingHorizontal: wp(16),
    },
    withBorder: {
      borderBottomWidth: 1,
      borderColor: colors.image_bg,
    },
    imageStyle: {
      width: 16,
      height: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.text_gray,
      resizeMode: 'cover',
      marginRight: wp(8),
    },
    editIcon: {
      width: 16,
      height: 16,
      resizeMode: 'contain',
    },
    viewStyle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleText: {
      flex: 1,
      ...commonFontStyle(400, 14, colors.title_dec100),
    },
  });
};
