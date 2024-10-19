import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import {
  getAddress,
  requestLocationPermission,
} from '../../utils/loactionHandler';
import {
  getAsyncLocation,
  setAsyncLocation,
} from '../../utils/asyncStorageManager';
import HomeHeader from '../../compoment/HomeHeader';
import ChartsView from '../../compoment/ChartsView';
import CardView from '../../compoment/CardView';
import {
  commonFontStyle,
  hp,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  statusBarHeight,
  wp,
} from '../../theme/fonts';
import {Icons} from '../../utils/images';
import OrderModal from '../../compoment/OrderModal';
import {screenName} from '../../navigation/screenNames';
import {strings} from '../../i18n/i18n';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {getCuisinesAction} from '../../actions/cuisinesAction';
import {getChefsAction} from '../../actions/chefsAction';
import {
  getDashboardAction,
  getMiscellaneousAction,
} from '../../actions/menuAction';
import {light_theme} from '../../theme/colors';
import {getDiscountAction} from '../../actions/commonAction';
import {
  getOrdersRequestAction,
  getRunningOrderAction,
} from '../../actions/allOrdersAction';
import moment from 'moment';
import Spacer from '../../compoment/Spacer';
import {getUserAction} from '../../actions/authAction';

type Props = {};

const Home = (props: Props) => {
  const {colors, isDark} = useTheme();
  const navigation = useNavigation();
  const isFocuse = useIsFocused();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const {isDarkTheme, discount} = useAppSelector(state => state.common);
  const {getDashboardData} = useAppSelector(state => state.data);
  const [value, setValue] = useState('');
  const [runningOrderModal, setRunninOrderModal] = useState(false);
  const [orderRequestModal, setOrderRequestModal] = useState(false);
  const dispatch = useAppDispatch();

  const GetStatus = async () => {
    const Status = await getAsyncLocation();
    setValue(Status);
  };

  const getCurrentLocation = async () => {
    await requestLocationPermission(
      async response => {
        await getAddress(
          response,
          async (result: any) => {
            console.log(
              'result?.results?.[0]?.formatted_address',
              result?.results?.[0]?.formatted_address,
            );

            setValue(result?.results?.[0]?.formatted_address);
            result?.results?.length
              ? await setAsyncLocation(result?.results?.[0]?.formatted_address)
              : await setAsyncLocation('Mohali,Punjab');
            await GetStatus();
          },
          err => {
            console.log('map', err);
          },
        );
      },
      err => {
        console.log('Home Location API', err);
      },
    );
  };

  useEffect(() => {
    getCurrentLocation();
    onGetDataProfile();
  }, []);

  const onGetDataProfile = async () => {
    let obj = {
      onSuccess: (res: any) => {},
      onFailure: (Err: any) => {},
    };
    dispatch(getUserAction(obj));
  };

  useEffect(() => {
    if (isFocuse) {
      getDiscount();
      getDashboard();
      getCuisinesList();
      getChefsList();
      getMiscellaneousList();
    }
  }, [isFocuse]);

  const getCuisinesList = () => {
    let obj = {
      data: {
        page: 1,
        limit: 15,
        pagination: false,
      },
      onSuccess: (res: any) => {},
      onFailure: (Err: any) => {},
    };
    dispatch(getCuisinesAction(obj));
  };

  const getMiscellaneousList = () => {
    let obj = {
      data: {
        page: 1,
        limit: 10,
        pagination: false,
      },
      onSuccess: (res: any) => {},
      onFailure: (Err: any) => {},
    };
    dispatch(getMiscellaneousAction(obj));
  };

  const getChefsList = () => {
    let obj = {
      onSuccess: (res: any) => {},
      onFailure: (Err: any) => {},
    };
    dispatch(getChefsAction(obj));
  };

  const getDashboard = () => {
    let obj = {
      params: {
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
      },
      onSuccess: (res: any) => {},
      onFailure: (Err: any) => {},
    };
    dispatch(getDashboardAction(obj));
  };

  const getDiscount = () => {
    let obj = {
      onSuccess: (res: any) => {},
      onFailure: (Err: any) => {},
    };
    dispatch(getDiscountAction(obj));
  };
  const onPressLocation = () => {
    // @ts-ignore
    // navigate(screenName.Map_Location);
    // navigate(screenName.SelectLocation);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={colors.white}
      />
      <HomeHeader
        onPressProfile={() => {}}
        onPressCart={() => {}}
        location={value}
        onPressLocation={onPressLocation}
        isHideIcon={true}
        showRight={true}
        isCreateIcon={true}
        onRightPressNotification={() => {
          setOrderRequestModal(true);
          // navigation.navigate(screenName.tab_bar_name?.Notification);
        }}
      />
      <ScrollView style={{flex: 1, marginHorizontal: hp(20)}}>
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
        {/* <ImageBackground
          source={Icons.banner}
          resizeMode="stretch"
          style={{
            width: SCREEN_WIDTH * 0.94,
            height: SCREEN_HEIGHT * 0.13,
            marginVertical: 12,
            justifyContent: 'center',
            marginHorizontal: wp(20),
            alignSelf: 'center',
            top: -10,
          }}>
          {discount === 0 ? null : (
            <ImageBackground
              source={Icons.ic_dec}
              resizeMode="contain"
              style={{
                width: 90,
                height: 90,
                alignSelf: 'flex-end',
                marginRight: SCREEN_WIDTH * 0.1,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text style={styles.bannerText}>{`${discount}%`}</Text>
              <Text style={styles.bannerText1}>{'OFF'}</Text>
            </ImageBackground>
          )}
        </ImageBackground> */}
        <View style={styles.headerCard}>
          <CardView
            containerStyle={styles.headerView}
            onPress={() => setRunninOrderModal(true)}
            isDisabled={true}>
            <Image source={Icons.runnigIcon} style={styles.runnigStyle} />
            {/* <Text style={styles.headerText}>20</Text> */}
            <Text style={styles.headerSubText}>
              {strings('home.running_orders')}
            </Text>
          </CardView>
          <Spacer width={16} />
          <CardView
            isDisabled={true}
            onPress={() => setOrderRequestModal(true)}
            containerStyle={styles.headerView}>
            <Image source={Icons.ic_order} style={styles.runnigStyle} />
            <Text style={styles.headerSubText}>
              {strings('home.order_request')}
            </Text>
          </CardView>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: hp(20),
          }}>
          <Text style={styles.seeText1}>{strings('home.Revenue')}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(screenName.OrderHistory)}>
            <Text style={styles.seeText}>{strings('home.see_details')}</Text>
          </TouchableOpacity>
        </View>
        <CardView>
          <ChartsView />
        </CardView>
        {/* <CardView containerStyle={styles.reviewView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.reviewStyle}>{strings('home.reviews')}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(screenName.ReviewsScreen)}>
              <Text style={styles.seeAllText}>
                {strings('home.see_all_reviews')}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
            <Image source={Icons.star} style={styles.starStyle} />
            <Text style={styles.rateText}>4.9</Text>
            <Text style={styles.rateText1}>Total 20 Reviews</Text>
          </View>
        </CardView> */}
        {/* <CardView containerStyle={styles.reviewView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.reviewStyle}>
              {strings('home.populer_items_this_weeks')}
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAllText}>{strings('home.see_all')}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={[1, 2, 3, 4]}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={() => {
              return <View style={styles.itemStyle}></View>;
            }}
          />
        </CardView> */}
        <View style={{height: 100}} />

        {runningOrderModal && (
          <OrderModal
            isVisible={runningOrderModal}
            onPressCancel={() => setRunninOrderModal(false)}
            isRunning={true}
          />
        )}

        {orderRequestModal && (
          <OrderModal
            isVisible={orderRequestModal}
            onPressCancel={() => setOrderRequestModal(false)}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default Home;

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    headerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'space-between',
      marginVertical: 0,
    },
    headerView: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colors.Primary_BG,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 2,
      borderRadius: 8,
    },
    runnigStyle: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
      tintColor: colors.text_orange,
    },
    headerText: {
      alignSelf: 'center',
      ...commonFontStyle(700, 52, colors.Title_Text),
    },
    headerSubText: {
      ...commonFontStyle(400, 14, colors.black),
      alignSelf: 'center',
      marginLeft: 10,
    },
    reviewStyle: {
      ...commonFontStyle(400, 14, colors.Title_Text),
      flex: 1,
    },
    seeAllText: {
      ...commonFontStyle(400, 14, colors.Primary_Orange),
      textDecorationLine: 'underline',
    },
    rateText: {
      marginLeft: 4,
      ...commonFontStyle(700, 21, colors.Primary_Orange),
    },
    rateText1: {
      ...commonFontStyle(400, 14, colors.Title_Text),
      marginLeft: 18,
    },
    reviewView: {
      paddingHorizontal: 16,
      paddingVertical: 15,
      marginTop: 14,
    },
    starStyle: {
      width: 25,
      height: 25,
    },
    itemStyle: {
      width: wp(150),
      height: wp(150),
      borderWidth: 1,
      marginTop: 20,
      marginBottom: 8,
      marginLeft: 16,
      borderRadius: 8,
      borderColor: colors.black,
    },
    bannerText: {
      ...commonFontStyle(800, 36, light_theme.white),
      alignSelf: 'center',
      marginRight: wp(10),
    },
    bannerText1: {
      ...commonFontStyle(700, 20, light_theme.white),
      lineHeight: 20,
      position: 'absolute',
      bottom: -2,
      right: 5,
    },
    seeText: {
      ...commonFontStyle(400, 14, colors.text_orange),
      textDecorationLine: 'underline',
    },
    seeText1: {
      ...commonFontStyle(500, 18, colors.black),
    },
    hurrUpView: {
      backgroundColor: colors.text_orange,
      padding: 16,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: hp(20),
    },
    hurryText: {
      ...commonFontStyle(800, 18, colors.defult_white),
    },
    allText: {
      ...commonFontStyle(400, 14, colors.defult_white),
    },
  });
};
