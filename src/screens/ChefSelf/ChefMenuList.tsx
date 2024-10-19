import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useIsFocused, useNavigation, useTheme} from '@react-navigation/native';
import HomeHeader from '../../compoment/HomeHeader';
import {commonFontStyle, hp, SCREEN_WIDTH, wp} from '../../theme/fonts';
import {strings} from '../../i18n/i18n';
import MenuCardList from '../../compoment/MenuCardList';
import {getCuisinesAction} from '../../actions/cuisinesAction';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {
  getCuisinesMenuListAction,
  getMenuAction,
} from '../../actions/menuAction';
import {GET_EMPTY_MENU_LIST, GET_MENU_DATA} from '../../redux/actionTypes';
import {Icons} from '../../utils/images';
import {screenName} from '../../navigation/screenNames';
import ToggleComponent from '../../compoment/ToggleComponent';
import {setFoodVeg} from '../../utils/commonActions';

type Props = {};

const MyMenuList = (props: Props) => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const isFocuse = useIsFocused();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const [tabSelection, setTabSelection] = useState(strings('myMenuList.all'));
  const [refreshing, setRefreshing] = React.useState(false);
  const [cuisineId, setCuisineId] = React.useState(0);
  const dispatch = useAppDispatch();
  const {getCuisines, getMenuData, allMenuCount} = useAppSelector(
    state => state.data,
  );
  const {isDarkTheme, isLanguage} = useAppSelector(state => state.common);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [onEndReached, setOnEndReached] = useState(true);
  const [photoUri, setPhotoUri] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterData, setFilterData] = useState([]);
  const {isFoodVeg} = useAppSelector(state => state.common);
  const refFlatList = useRef();
  const trackColor = isFoodVeg !== 2 ? colors.green_text : colors.red_text;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (tabSelection === strings('myMenuList.all')) {
      getMenuList(1);
    } else {
      getAllCuisinesMenuList(cuisineId, 1);
    }
  }, [refreshing, tabSelection]);

  useEffect(() => {
    getCuisinesList(1);
    getMenuList(1);
    setTabSelection(strings('myMenuList.all'));
    // if (tabSelection === strings('myMenuList.all')) {
    //   getMenuList(1);
    // } else {
    //   getAllCuisinesMenuList(cuisineId, 1);
    // }
  }, [isFocuse, isLanguage]);

  const getCuisinesList = (pages: number) => {
    let obj = {
      data: {
        page: pages,
        limit: 5,
        pagination: false,
      },
      onSuccess: (res: any) => {},
      onFailure: (Err: any) => {},
    };
    dispatch(getCuisinesAction(obj));
  };

  const getMenuList = (pages: number) => {
    let obj = {
      data: {
        page: pages,
        limit: 8,
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

  const onSearchBar = (text: string) => {
    setSearchQuery(text);

    const filteredItems = getMenuData
      ?.filter(f => {
        return f?.food_type == isFoodVeg;
      })
      ?.filter((f: any) => f?.name?.toLowerCase()?.match(text?.toLowerCase()));
    setFilterData(filteredItems);
  };

  const getAllCuisinesMenuList = (id: number, pages: number) => {
    let obj = {
      id: id,
      data: {
        page: pages,
        limit: 8,
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
    dispatch(getCuisinesMenuListAction(obj));
  };

  const loadMoreData = () => {
    if (!onEndReached && getMenuData?.length >= 8) {
      if (getMenuData && getMenuData?.length < allMenuCount) {
        setLoadingMore(true);
        if (tabSelection === strings('myMenuList.all')) {
          getMenuList(page + 1);
        } else {
          getAllCuisinesMenuList(cuisineId, page + 1);
        }
      }
    }
  };

  const onTabChange = (item: any) => {
    setPage(1);
    setTabSelection(item.name);
    setCuisineId(item.id);
    setLoading(true);
    // dispatch({type: GET_EMPTY_MENU_LIST, payload: false});
    setTimeout(() => {
      if (item.name === strings('myMenuList.all')) {
        getMenuList(1);
      } else {
        getAllCuisinesMenuList(item.id, 1);
      }
    }, 100);
  };

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

  const changeValue = () => {
    const newValue = isFoodVeg === 1 ? 2 : 1;
    console.log('newValue', newValue);

    setSearchQuery('');
    // if (tabSelection === strings('myMenuList.all')) {
    //   getMenuList(1, isFoodVeg === 1 ? 2 : 1);
    // } else {
    //   getAllCuisinesMenuList(cuisineId, 1, isFoodVeg === 1 ? 2 : 1);
    // }

    dispatch(setFoodVeg(newValue));
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
          console.log('dee');
          navigation.navigate(screenName.CuisinesNameList);
        }}
        mainShow={true}
        title={strings('myMenuList.my_menu')}
        extraStyle={styles.headerContainer}
        isShowIcon={true}
        isHideIcon={true}
        // rightText={strings('home.see_all')}
      />

      {getCuisines && getCuisines.length !== 0 && (
        <View style={styles.tabMainView}>
          <FlatList
            data={[
              {
                name: strings('myMenuList.all'),
                label: strings('myMenuList.all'),
                page: 0,
                id: 0,
              },
              ...getCuisines,
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

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          marginHorizontal: wp(20),
          marginVertical: hp(20),
        }}>
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

      <View style={styles.boxContainer}>
        <MenuCardList
          onRefresh={() => {
            onRefresh();
          }}
          filterData={filterData}
          loading={loading}
          searchQuery={searchQuery}
          refreshing={refreshing}
          setRefreshing={setRefreshing}
          loadMoreData={() => loadMoreData()}
          loadingMore={loadingMore}
          onMomentumScrollBegin={() => {
            setOnEndReached(false);
          }}
          showChef={true}
        />
      </View>
    </View>
  );
};

export default MyMenuList;

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
    allIconImage: {
      width: wp(30),
      height: wp(30),
      resizeMode: 'contain',
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
    vegText: {
      ...commonFontStyle(500, 14, colors.black),
      width: wp(59),
    },
  });
};
