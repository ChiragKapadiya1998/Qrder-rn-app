import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    useFocusEffect,
    useIsFocused,
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
import { getChefsAction } from '../../actions/chefsAction';
import CuisinesNameCardList from '../../compoment/CuisinesNameCardList';
import {
    deleteCuisinesAction,
    deleteMiscellaneousAction,
    getCuisinesAction,
} from '../../actions/cuisinesAction';
import AddFolderModal from '../../compoment/AddFolderModal';
import EditFolderModal from '../../compoment/EditFolderModal';
import Loader from '../../compoment/Loader';
import { deleteMenuAction, getMenuAction, getMiscellaneousAction } from '../../actions/menuAction';

type Props = {};

const MenuList = (props: Props) => {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation();
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    const { isDarkTheme, isLoadingNew } = useAppSelector(state => state.common);
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { getMenuData, allMenuCount } = useAppSelector(
        state => state.data,
    );
    const [selectItem, setSelectItem] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [onEndReached, setOnEndReached] = useState(true);
    const dispatch = useAppDispatch();
    const isFocused = useIsFocused();

    const currentData = useRef();
    currentData.current = getMenuData;
    const hasMoreItems = currentData.current?.length < allMenuCount;

    const closeModal = () => {
        setVisible(false);
    };

    useFocusEffect(
        useCallback(() => {
            getMenuList(1);
        }, [isFocused,isLoadingNew]),
      );

    const removeMenuCardList = () => {
        let UserInfo = {
            data: selectItem?.id,
            onSuccess: (res: any) => {
                setRefreshing(false);
            },
            onFailure: (Err: any) => {
                setRefreshing(false);
            },
        };
        dispatch(deleteMenuAction(UserInfo));
    };

    const onPressDelete = () => {
        setVisible(false);
        removeMenuCardList();
    };

    const getMenuList = (pages: number) => {
        let obj = {
            data: {
                page: pages,
                limit: 7,
                pagination: false,
            },
            onSuccess: (res: any) => {
                setRefreshing(false);
                setLoadingMore(false);
                setPage(pages);
                setLoading(false);
            },
            onFailure: (Err: any) => {
                setRefreshing(false);
                setLoadingMore(false);
                setLoading(false);
            },
        };
        dispatch(getMenuAction(obj));
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getMenuList(1);
    }, [refreshing]);

    const onMomentumScrollBegin = () => {
        setOnEndReached(false);
    }

    const loadMoreData = () => {
        if (!onEndReached && getMenuData?.length >= 7) {
            if (getMenuData && getMenuData?.length < allMenuCount) {
                setLoadingMore(true);
                getMenuList(page + 1);
            }
        }
    };
    const onPressedit = (item) => {
        navigation.navigate(screenName.EditMenuList, { itemData: item })
    };

    const onDeleteManuItem = (item) => {
        setVisible(true);
        setSelectItem(item);
    }

console.log("====<><><",currentData.current)
    const renderItem = ({ item, index }) => {
        const isLastItem = index === currentData.current.length - 1;
        return (
            <View style={styles.subBoxView}>
                <View style={styles.containers}>
                    <View style={[styles.leftView, !isLastItem && styles.withBorder]}>
                        <View style={[styles.viewStyle, { flex: 1 }]}>
                            <Text numberOfLines={1} style={styles.titleText}>
                                {item?.name || item?.menu_name}
                            </Text>
                        </View>
                        <Text style={[styles.titleText]}>{item?.price}</Text>
                        <View style={styles.viewStyle}>
                            <TouchableOpacity onPress={() => onPressedit(item)}>
                                <Image source={Icons.editItemIcon} style={styles.editIcon} />
                            </TouchableOpacity>
                            <Spacer width={8} />
                            <TouchableOpacity onPress={() => onDeleteManuItem(item)}>
                                <Image source={Icons.deleteItemIcon} style={styles.editIcon} />
                            </TouchableOpacity>
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
                    navigation.navigate(screenName.tab_bar_name.AddFoodDetails);
                }}
                mainShow={true}
                title={strings('menuList.menu')}
                extraStyle={styles.headerContainer}
                createText={strings('miscellaneousList.add')}
                isShowIcon={false}
                isCreateIcon={true}
            />

            <View style={[styles.boxView]}>
                {currentData.current &&
                    <FlatList
                        onEndReachedThreshold={0.3}
                        data={currentData.current}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        ListEmptyComponent={<NoDataFound />}
                        onMomentumScrollBegin={onMomentumScrollBegin}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
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
                        renderItem={renderItem}
                        contentContainerStyle={{paddingBottom:hp(100)}}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            loading ? (
                                <ActivityIndicator size={'small'} color={colors.black} />
                            ) : (
                                <NoDataFound />
                            )
                        }
                        // ListFooterComponent={() => (
                        //     <View>
                        //         {hasMoreItems && !loadingMore && (
                        //             <TouchableOpacity
                        //                 onPress={loadMoreData}
                        //                 style={[styles.seeMoreButton]}
                        //             >
                        //                 <Text style={styles.seeMoreText}>
                        //                     {strings('CardMenuList.see_more')}
                        //                 </Text>
                        //             </TouchableOpacity>
                        //         )}
                        //         {loadingMore && (
                        //             <View style={styles.seeMoreButton}>
                        //                 <ActivityIndicator size={'small'} color={colors.black} />
                        //             </View>

                        //         )}
                        //         <View style={{ height: hp(150) }} />
                        //     </View>
                        // )}
                    />
                }
            </View>
            {/* <Spacer height={30}/> */}
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

export default MenuList;

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
        headerList: {
            backgroundColor: colors.cards_bg,
            height: hp(42),
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: wp(16),
            borderRadius: 8,
            flexDirection: 'row',
        },
        nameText: {
            ...commonFontStyle(500, 16, colors.black),
        },
        boxView: {
            marginHorizontal: wp(20)
        },
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
            ...commonFontStyle(400, 14, colors.black),
        },
    });
};
