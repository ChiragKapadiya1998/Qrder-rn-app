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
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useIsFocused, useNavigation, useTheme } from '@react-navigation/native';
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
import { getChefsAction } from '../../actions/chefsAction';
import CuisinesNameCardList from '../../compoment/CuisinesNameCardList';
import { deleteCuisinesAction, getCuisinesAction } from '../../actions/cuisinesAction';
import AddFolderModal from '../../compoment/AddFolderModal';
import EditFolderModal from '../../compoment/EditFolderModal';
import Loader from '../../compoment/Loader';
import ItemMastersCardList from '../../compoment/ItemMastersCardList';

type Props = {};

const ItemMastersList = (props: Props) => {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation();
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    const { isDarkTheme } = useAppSelector(state => state.common);
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { getCuisines, cuisinesCount } = useAppSelector(state => state.data);
    const [getAllData, setGetAllData] = useState(getCuisines)
    const [newFolder, setNewFolder] = useState(false);
    const [editFolder, setEditFolder] = useState(false);
    const [selectItem, setSelectItem] = useState({});
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const isFocused = useIsFocused()

    const closeModal = () => {
        setVisible(false);
    };

    useFocusEffect(
        useCallback(() => {
            setGetAllData(getCuisines)
        }, [isFocused, getCuisines?.length])
    );


    // useEffect(() => {
    //   setGetAllData(getCuisines)
    // }, [getCuisines?.length, isFocused])

    const removeMenuCardList = () => {
        let UserInfo = {
            data: selectItem?.id,
            onSuccess: (res: any) => {
                closeModal()
            },
            onFailure: (Err: any) => { },
        };
        dispatch(deleteCuisinesAction(UserInfo));
    };

    const onPressDelete = () => {
        setVisible(false);
        removeMenuCardList();
    };

    useEffect(() => {
        getCuisinesList(1);
    }, [newFolder, editFolder]);

    const getCuisinesList = (pages: number) => {
        let obj = {
            data: {
                page: pages,
                limit: 15,
                pagination: false
            },
            onSuccess: (res: any) => {
                setGetAllData(res?.data)
                setLoading(false);
            },
            onFailure: (Err: any) => {
                setLoading(false);
            },
        };
        dispatch(getCuisinesAction(obj));
    };

    const onSearchBar = (text: string) => {
        setSearchQuery(text)
        const filteredItems = getCuisines?.filter((f: any) =>
            f?.name?.toLowerCase()?.match(text?.toLowerCase()),
        )
        setGetAllData(filteredItems)
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
                    navigation.navigate(screenName.AddItemMasters);
                    // setNewFolder(true)
                }}
                mainShow={true}
                title={strings('itemMastersList.item_masters')}
                extraStyle={styles.headerContainer}
                createText={strings('CuisinesNameList.create')}
                isShowIcon={false}
                isCreateIcon={true}
            />
            <View style={{ marginHorizontal: wp(20) }}>
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
                                    <Text style={[styles.nameText,{flex:1}]}>{strings('CuisinesNameList.names')}</Text>
                                    <Text style={[styles.nameText,{flex:1}]}>{strings('recipesMaster.unit')}</Text>
                                    <Text numberOfLines={1} style={[styles.nameText,{flex:1}]}>{strings('itemMastersList.in_weight')}</Text>
                                    <Text numberOfLines={1} style={[styles.nameText,{flex:1}]}>{strings('itemMastersList.out_weight')}</Text>
                                    <Text style={styles.nameText}>{strings('CuisinesNameList.action')}</Text>
                                </View>
                            )
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                <ItemMastersCardList
                                    item={item}
                                    onPressEdit={() => {
                                        navigation.navigate(screenName.EditItemMasters);
                                        setSelectItem(item);
                                    }}
                                    setDelete={() => {
                                        setVisible(true);
                                        setSelectItem(item);
                                    }}
                                />
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={() => {
                            return (
                                <View style={{ height: 150 }} />
                            );
                        }}
                    />)}
            </View>
            {/* <AddFolderModal
          isVisible={newFolder}
          onClose={() => setNewFolder(false)}
        />
        <EditFolderModal
          selectItem={selectItem}
          isVisible={editFolder}
          onClose={() => setEditFolder(false)}
        /> */}
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

export default ItemMastersList;

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
            height: hp(44)
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
            flexDirection: 'row'
        },
        nameText: {
            ...commonFontStyle(500, 14, colors.black),
        }
    });
};
