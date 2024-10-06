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
import {GET_EMPTY_MENU_LIST} from '../../redux/actionTypes';
import {Icons} from '../../utils/images';
import {screenName} from '../../navigation/screenNames';

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
  const {isDarkTheme} = useAppSelector(state => state.common);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [onEndReached, setOnEndReached] = useState(true);
  const [photoUri, setPhotoUri] = useState(null);
  const refFlatList = useRef();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (tabSelection === 'All') {
      getMenuList(1);
    } else {
      getAllCuisinesMenuList(cuisineId, 1);
    }
  }, [refreshing, tabSelection]);

  useEffect(() => {
    getCuisinesList(1);
    if (tabSelection === 'All') {
      getMenuList(1);
    } else {
      getAllCuisinesMenuList(cuisineId, 1);
    }
  }, [isFocuse]);

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
        limit: 7,
        pagination: true,
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

  const getAllCuisinesMenuList = (id: number, pages: number) => {
    let obj = {
      id: id,
      data: {
        page: pages,
        limit: 7,
        pagination: true,
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
    if (!onEndReached && getMenuData?.length >= 7) {
      if (getMenuData && getMenuData?.length < allMenuCount) {
        setLoadingMore(true);
        if (tabSelection === 'All') {
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
    dispatch({type: GET_EMPTY_MENU_LIST, payload: false});
    setTimeout(() => {
      if (item.name === 'All') {
        getMenuList(1);
      } else {
        getAllCuisinesMenuList(item.id, 1);
      }
    }, 100);
  };

  const renderItem = ({item}) => {
    const selectColor =
      tabSelection === item.name ? colors.text_orange : colors.text_gray;
    return (
      <View>
        <TouchableOpacity
          onPress={() => onTabChange(item)}
          style={styles.cuisineView}>
          {item.name === 'All' ? (
            <View style={[styles.allImage, {borderColor: selectColor}]}>
              <Image
                source={Icons.allIcon}
                style={[styles.allIconImage, {tintColor: selectColor}]}
              />
            </View>
          ) : (
            <Image
              source={item.name === 'All' ? Icons.allIcon : {uri: item.image}}
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

  console.log('getCuisines', getCuisines);

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
              {name: 'All', label: strings('myMenuList.all'), page: 0, id: 0},
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

      <View style={styles.boxContainer}>
        <MenuCardList
          onRefresh={() => {
            onRefresh();
          }}
          loading={loading}
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
  });
};
