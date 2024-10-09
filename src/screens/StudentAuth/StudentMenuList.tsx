import {
  FlatList,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import HomeHeader from '../../compoment/HomeHeader';
import { commonFontStyle, hp, SCREEN_WIDTH, wp } from '../../theme/fonts';
import { strings } from '../../i18n/i18n';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import CartMenuCardList from '../../compoment/CartMenuCardList';
import { getCanteenCuisineAction, getCanteenMenuAction, getDiscountAction, getStudentMenuListAction } from '../../actions/commonAction';
import { GET_CANTEEN_CUISINE_LIST, GET_EMPTY_CANTEEN_LIST } from '../../redux/actionTypes';
import { Icons } from '../../utils/images';


const StudentMenuList = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { params } = useRoute < any > ();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const [tabSelection, setTabSelection] = useState(strings('myMenuList.all'));
  const [refreshing, setRefreshing] = React.useState(false);
  const [cuisineId, setCuisineId] = React.useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const dispatch = useAppDispatch();
  const { getCanteenCuisines, getCanteenMenuData, canteenMenuCount } = useAppSelector(state => state.data);
  const { isDarkTheme, discount } = useAppSelector(state => state.common);
  const [onEndReached, setOnEndReached] = useState(true);
  const isFocuse = useIsFocused();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (tabSelection === 'All') {
      getMenuList(1);
    } else {
      getAllCuisinesMenuList(cuisineId, 1)
    }
  }, [refreshing, cuisineId]);

  useEffect(() => {
    getCanteenCuisineList();
    getMenuList(1);
  }, []);

  const getCanteenCuisineList = () => {
    let obj = {
      params: params?.selectID,
      onSuccess: () => { },
      onFailure: () => { },
    };
    dispatch(getCanteenCuisineAction(obj));
  };

  const getMenuList = (pages: number) => {
    let obj = {
      id: params?.selectID,
      data: {
        page: pages,
        limit: 7,
        pagination: true,
      },
      onSuccess: (res: any) => {
        setRefreshing(false);
        setLoadingMore(false);
        setPage(pages);
        setLoading(false)
      },
      onFailure: (Err: any) => {
        setRefreshing(false);
        setLoadingMore(false);
        setLoading(false)
      },
    };
    dispatch(getCanteenMenuAction(obj));
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
        setLoading(false)
      },
      onFailure: (Err: any) => {
        setRefreshing(false);
        setLoadingMore(false);
        setLoading(false)
      },
    };
    dispatch(getStudentMenuListAction(obj));
  };

  const loadMoreData = () => {
    if (!onEndReached && getCanteenMenuData?.length >= 7) {
      if (getCanteenMenuData && getCanteenMenuData?.length < canteenMenuCount) {
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
    dispatch({ type: GET_EMPTY_CANTEEN_LIST, payload: false });
    setTimeout(() => {
      if (item.name === 'All') {
        getMenuList(1);
      } else {
        getAllCuisinesMenuList(item.id, 1);
      }
    }, 100);
  };


  const renderItem = ({ item }) => {
    const selectColor =
      tabSelection === item.name ? colors.text_orange : colors.text_gray;
    return (
      <View>
        <TouchableOpacity
          onPress={() => onTabChange(item)}
          style={styles.cuisineView}>
          {item.name === 'All' ? (
            <View style={[styles.allImage, { borderColor: selectColor }]}>
              <Image
                source={Icons.allIcon}
                style={[styles.allIconImage, { tintColor: selectColor }]}
              />
            </View>
          ) : (
            <Image
              source={item.name === 'All' ? Icons.allIcon : { uri: item.image }}
              style={[styles.profilImage, { borderColor: selectColor }]}
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
      <StatusBar barStyle={isDarkTheme ? 'light-content' : 'dark-content'} backgroundColor={colors.white} />
      <HomeHeader
        onBackPress={() => {
          navigation.goBack();
          dispatch({ type: GET_EMPTY_CANTEEN_LIST, payload: false });
          dispatch({ type: GET_CANTEEN_CUISINE_LIST, payload: [] });
        }}
        onRightPress={() => {
          console.log('dee');
        }}
        mainShow={true}
        title={params?.canteenName ? params?.canteenName : strings('myMenuList.my_menu')}
        extraStyle={styles.headerContainer}
        isShowIcon={false}
        isCardIcon={false}
      />
      {discount === 0 ? null :
        <View style={styles.hurrUpView}>
          <View>
            <Text style={styles.hurryText}>{strings('newAddText.hurry_up')}</Text>
            <Text style={styles.hurryText}>{strings('newAddText.up_to')}</Text>
          </View>
          <ImageBackground
            source={Icons.ic_dec}
            resizeMode="contain"
            style={{
              width: 90,
              height: 90,
              alignSelf: 'flex-end',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={styles.bannerText}>{`${discount}%`}</Text>
          </ImageBackground>
        </View>}


      {getCanteenCuisines && getCanteenCuisines.length !== 0 && (
        <View style={styles.tabMainView}>
          <FlatList
            data={[
              { name: 'All', label: strings('myMenuList.all'), page: 0, id: 0 },
              ...getCanteenCuisines,
            ]}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            onEndReachedThreshold={0.5}
            renderItem={renderItem}
          />
        </View>
      )}


      {/* {getCanteenCuisines?.length === 0 ? null :
        <View style={styles.tabMainView}>
          <FlatList
            data={[
              { name: 'All', label: strings('myMenuList.all'), page: 0, id: 0 },
              ...getCanteenCuisines,
            ]}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            onEndReachedThreshold={0.5}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onTabChange(item)}
                style={[
                  styles.tabItemView,
                  {
                    // borderBottomWidth: 1,
                    backgroundColor: tabSelection === item.name
                      ? colors.orange_bg
                      : colors.card_bg,
                    marginBottom: hp(16),
                    // borderColor:
                    //   tabSelection === item.name
                    //     ? colors.headerText3
                    //     : colors.card_bg,
                  },
                ]}>
                <View
                  style={[
                    styles.imageView,
                    {
                      backgroundColor: tabSelection === item.name
                        ? colors.image_Bg_gray
                        : colors.image_Bg_gray
                    },
                  ]}
                />
                <Text
                  style={{
                    color:
                      tabSelection === item.name
                        ? colors.black
                        : colors.Title_Text,
                  }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.underlineAll} />
        </View>} */}

      <View style={styles.boxContainer}>
        <CartMenuCardList onRefresh={() => {
          onRefresh()
        }}
          refreshing={refreshing}
          loading={loading}
          loadMoreData={() => loadMoreData()}
          loadingMore={loadingMore}
          onMomentumScrollBegin={() => {
            setOnEndReached(false)
          }}
        />
      </View>
    </View>
  );
};

export default StudentMenuList;

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
      marginBottom: hp(20)
    },
    hurryText: {
      ...commonFontStyle(800, 18, colors.defult_white),
    },
    allText: {
      marginTop: hp(10),
      ...commonFontStyle(400, 14, colors.defult_white),
    },
    bannerText: {
      ...commonFontStyle(800, 40, colors.defult_white),
      alignSelf: 'center',
      top: 5,
    },
  });
};
