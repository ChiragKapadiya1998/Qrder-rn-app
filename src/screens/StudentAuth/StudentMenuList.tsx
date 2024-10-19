import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  useIsFocused,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import HomeHeader from '../../compoment/HomeHeader';
import {commonFontStyle, hp, SCREEN_WIDTH, wp} from '../../theme/fonts';
import {strings} from '../../i18n/i18n';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import CartMenuCardList from '../../compoment/CartMenuCardList';
import {
  getCanteenCuisineAction,
  getCanteenMenuAction,
  getDiscountAction,
  getStudentMenuListAction,
  searchCities,
  searchMenuList,
} from '../../actions/commonAction';
import {
  GET_CANTEEN_CUISINE_LIST,
  GET_CANTEEN_MENU_LIST,
  GET_EMPTY_CANTEEN_LIST,
  GET_SEARCH,
} from '../../redux/actionTypes';
import {Icons} from '../../utils/images';
import ToggleComponent from '../../compoment/ToggleComponent';
import {setFoodVeg} from '../../utils/commonActions';
import debounce from 'lodash/debounce';

const StudentMenuList = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const {params} = useRoute<any>();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const [tabSelection, setTabSelection] = useState(strings('myMenuList.all'));
  const [refreshing, setRefreshing] = React.useState(false);
  const [cuisineId, setCuisineId] = React.useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const dispatch = useAppDispatch();
  const {getCanteenCuisines, getCanteenMenuData, canteenMenuCount, getSearch} =
    useAppSelector(state => state.data);
  const {isDarkTheme, discount, isFoodVeg} = useAppSelector(
    state => state.common,
  );
  const [onEndReached, setOnEndReached] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterData, setFilterData] = useState(getCanteenMenuData);
  const isFocuse = useIsFocused();
  const trackColor = isFoodVeg !== 2 ? colors.green_text : colors.red_text;

  const changeValue = () => {
    const newValue = isFoodVeg === 1 ? 2 : 1;

    setSearchQuery('');
    if (tabSelection === strings('myMenuList.all')) {
      getMenuList(1, isFoodVeg === 1 ? 2 : 1);
    } else {
      getAllCuisinesMenuList(cuisineId, 1, isFoodVeg === 1 ? 2 : 1);
    }
    dispatch(setFoodVeg(newValue));
  };

  const debouncedFilterSearch = React.useCallback(
    debounce(searchText => {
      let UserInfo = {
        data: `${params?.selectID}/${searchText}`,
        params: {food_type: isFoodVeg},
        onSuccess: res => {
          setFilterData(res?.data);
        },
        onFailure: Err => {},
      };
      dispatch(searchMenuList(UserInfo));
    }, 300),
    [isFoodVeg],
  );

  const FilterSearch = (searchText: any) => {
    setSearchQuery(searchText);
    if (searchText === '') {
      dispatch({type: GET_SEARCH, payload: []});
    }
    if (searchText.length >= 3) {
      debouncedFilterSearch(searchText);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (tabSelection === strings('myMenuList.all')) {
      getMenuList(1, isFoodVeg);
    } else {
      getAllCuisinesMenuList(cuisineId, 1, isFoodVeg);
    }
  }, [refreshing, tabSelection]);

  useEffect(() => {
    getCanteenCuisineList();
  }, []);

  useEffect(() => {
    if (tabSelection === strings('myMenuList.all')) {
      getMenuList(1, isFoodVeg);
    } else {
      getAllCuisinesMenuList(cuisineId, 1, isFoodVeg);
    }
  }, [isFocuse]);

  const getCanteenCuisineList = () => {
    let obj = {
      params: params?.selectID,
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getCanteenCuisineAction(obj));
  };

  const getMenuList = (pages: number, isFoodVeg: any) => {
    let obj = {
      id: params?.selectID,
      data: {
        page: pages,
        limit: 8,
        pagination: false,
        food_type: isFoodVeg,
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
    dispatch(getCanteenMenuAction(obj));
  };

  const getAllCuisinesMenuList = (
    id: number,
    pages: number,
    isFoodVeg: any,
  ) => {
    console.log('getAllCuisinesMenuList', isFoodVeg);

    let obj = {
      id: id,
      data: {
        page: pages,
        limit: 8,
        pagination: false,
        food_type: isFoodVeg,
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
    dispatch(getStudentMenuListAction(obj));
  };

  const loadMoreData = () => {
    if (!onEndReached && getCanteenMenuData?.length >= 8) {
      if (getCanteenMenuData && getCanteenMenuData?.length < canteenMenuCount) {
        setLoadingMore(true);
        if (tabSelection === strings('myMenuList.all')) {
          getMenuList(page + 1, isFoodVeg);
        } else {
          getAllCuisinesMenuList(cuisineId, page + 1, isFoodVeg);
        }
      }
    }
  };

  const onTabChange = (item: any) => {
    setPage(1);
    setTabSelection(item.name);
    setCuisineId(item.id);
    setLoading(true);
    // dispatch({ type: GET_EMPTY_CANTEEN_LIST, payload: false });
    setTimeout(() => {
      if (item.name === strings('myMenuList.all')) {
        getMenuList(1, isFoodVeg);
      } else {
        getAllCuisinesMenuList(item.id, 1, isFoodVeg);
      }
    }, 10);
  };

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      // This event runs when the screen is focused (navigated to)
      dispatch({type: GET_CANTEEN_MENU_LIST, payload: []});
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      // This event runs when the screen is unfocused (navigated away)
      dispatch({type: GET_CANTEEN_MENU_LIST, payload: []});
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation, isFocuse]);

  const renderItem = ({item}) => {
    const selectColor =
      tabSelection === item.name ? colors.text_orange : colors.text_gray;

    if (item.name === strings('myMenuList.all')) {
      return null;
    }

    return (
      <View>
        <TouchableOpacity
          onPress={() => onTabChange(item)}
          style={styles.cuisineView}>
          {item.name === strings('myMenuList.all') ? (
            <View style={[styles.allImage, {borderColor: selectColor}]}>
              <Image
                source={Icons.allIcon}
                style={[styles.allIconImage, {tintColor: selectColor}]}
              />
            </View>
          ) : (
            <Image
              source={
                item.name === strings('myMenuList.all')
                  ? Icons.allIcon
                  : {uri: item.image}
              }
              style={[styles.profilImage, {borderColor: selectColor}]}
            />
          )}
          <Text
            style={[
              styles.cuisinesText,
              {
                color:
                  tabSelection === item.name
                    ? colors.text_orange
                    : colors.black,
              },
            ]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={colors.white}
      />
      <HomeHeader
        onBackPress={() => {
          dispatch({type: GET_CANTEEN_CUISINE_LIST, payload: []});
          navigation.goBack();
          // dispatch({ type: GET_EMPTY_CANTEEN_LIST, payload: false });
        }}
        onRightPress={() => {
          console.log('dee');
        }}
        mainShow={true}
        title={
          params?.canteenName
            ? params?.canteenName
            : strings('myMenuList.my_menu')
        }
        extraStyle={styles.headerContainer}
        isShowIcon={false}
        isCardIcon={false}
      />

      {getCanteenMenuData.length || !loading ? (
        <>
          {discount === 0 ? null : (
            <View style={styles.hurrUpView}>
              <View>
                <Text style={styles.hurryText}>
                  {strings('newAddText.hurry_up')}
                </Text>
                <Text style={styles.hurryText}>
                  {strings('newAddText.discount')}
                </Text>
              </View>
              <Text style={styles.bannerText}>{`${discount}%`}</Text>
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-start',
              marginHorizontal: wp(20),
              marginBottom: hp(20),
            }}>
            <View style={styles.searchInputContainer}>
              <Image source={Icons.search} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={strings('CuisinesNameList.Search')}
                value={searchQuery}
                onChangeText={(t: string) => FilterSearch(t)}
                placeholderTextColor={colors.text_gray1}
              />
            </View>

            <ToggleComponent
              value={isFoodVeg === 2}
              onValueChange={() => changeValue()}
              trackColor={trackColor}
              toggleContainerStyle={styles.btnStyle}
              toggleWheel={styles.toggleWheels}
              isFood={true}
            />
            <Text numberOfLines={1} style={styles.vegText}>
              {isFoodVeg !== 2
                ? strings('addFoodList.veg')
                : strings('addFoodList.non_veg')}
            </Text>
          </View>

          {getCanteenCuisines && getCanteenCuisines.length !== 0 && (
            <View style={styles.tabMainView}>
              <FlatList
                data={[
                  {
                    name: strings('myMenuList.all'),
                    label: strings('myMenuList.all'),
                    page: 0,
                    id: 0,
                  },
                  ...getCanteenCuisines,
                ]}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{gap: 16}}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                onEndReachedThreshold={0.5}
                renderItem={renderItem}
              />
            </View>
          )}

          <View style={styles.boxContainer}>
            <CartMenuCardList
              filterData={filterData}
              onRefresh={() => {
                onRefresh();
              }}
              refreshing={refreshing}
              loading={loading}
              loadMoreData={() => loadMoreData()}
              loadingMore={loadingMore}
              onMomentumScrollBegin={() => {
                setOnEndReached(false);
              }}
              searchQuery={searchQuery}
            />
          </View>
        </>
      ) : (
        <View style={styles.centerLoadr}>
          <ActivityIndicator color={colors.black} />
        </View>
      )}
    </View>
  );
};

export default StudentMenuList;

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
    tabMainView: {
      flexDirection: 'row',
      marginHorizontal: wp(20),
    },
    cuisineView: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    allImage: {
      width: wp(48),
      height: wp(48),
      borderRadius: wp(48),
      borderColor: colors.text_gray,
      borderWidth: 1,
      backgroundColor: colors.cards_bg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    allIconImage: {
      width: wp(30),
      height: wp(30),
      resizeMode: 'contain',
    },
    profilImage: {
      width: wp(48),
      height: wp(48),
      borderRadius: wp(48),
      borderColor: colors.text_gray,
      borderWidth: 1,
      backgroundColor: colors.cards_bg,
      resizeMode: 'cover',
    },
    cuisinesText: {
      marginTop: hp(4),
      ...commonFontStyle(600, 14, colors.black),
    },
    boxContainer: {
      flex: 1,
      marginHorizontal: wp(20),
    },
    hurrUpView: {
      backgroundColor: colors.text_orange,
      padding: 16,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: wp(20),
      marginBottom: hp(20),
    },
    hurryText: {
      ...commonFontStyle(800, 18, colors.defult_white),
    },
    allText: {
      marginTop: hp(10),
      ...commonFontStyle(400, 14, colors.defult_white),
    },
    bannerText: {
      ...commonFontStyle(800, 36, colors.defult_white),
      alignSelf: 'center',
      marginRight: wp(10),
    },
    searchInputContainer: {
      borderRadius: 15,
      backgroundColor: colors.cards_bg,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(14),
      // flex: 1,
      width: SCREEN_WIDTH * 0.58,
    },
    searchInput: {
      flex: 1,
      color: colors.black,
      height: hp(54),
    },
    searchIcon: {
      width: 20,
      height: 20,
      tintColor: colors.border,
    },
    vegText: {
      ...commonFontStyle(500, 14, colors.black),
      width: wp(59),
    },
    btnStyle: {
      width: 32,
      height: 20,
      marginLeft: 14,
      marginRight: 12,
      borderRadius: 15,
      justifyContent: 'center',
    },
    toggleWheels: {
      width: 12,
      height: 12,
      borderRadius: 12,
    },
    centerLoadr: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
