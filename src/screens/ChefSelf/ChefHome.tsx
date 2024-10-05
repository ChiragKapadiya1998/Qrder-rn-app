import {
  FlatList,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useIsFocused, useNavigation, useTheme } from '@react-navigation/native';
import {
  getAddress,
  requestLocationPermission,
} from '../../utils/loactionHandler';
import {
  getAsyncLocation,
  setAsyncLocation,
} from '../../utils/asyncStorageManager';
import HomeHeader from '../../compoment/HomeHeader';
import CardView from '../../compoment/CardView';
import {
  commonFontStyle,
  hp,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  wp,
} from '../../theme/fonts';
import OrderModal from '../../compoment/OrderModal';
import { strings } from '../../i18n/i18n';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getCuisinesAction } from '../../actions/cuisinesAction';
import { getChefsAction } from '../../actions/chefsAction';
import { Icons } from '../../utils/images';
import { light_theme } from '../../theme/colors';
import PrimaryButton from '../../compoment/PrimaryButton';
import { screenName } from '../../navigation/screenNames';
import { getDiscountAction } from '../../actions/commonAction';
import { getRunningOrderAction, orderCompletedAction, orderDeclinedAction } from '../../actions/allOrdersAction';
import NoDataFound from '../../compoment/NoDataFound';
import { formatDate } from '../../utils/globalFunctions';
import Spacer from '../../compoment/Spacer';

const ChefHome = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const [value, setValue] = useState('');
  const [runningOrderModal, setRunninOrderModal] = useState(false);
  const [orderRequestModal, setOrderRequestModal] = useState(false);
  const { isDarkTheme, discount, isLoadingNew } = useAppSelector(state => state.common);
  const { isRunningOrder } = useAppSelector(state => state.orders);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const isFocuse = useIsFocused();

  console.log("=====<><><>", isRunningOrder)
  const GetStatus = async () => {
    const Status = await getAsyncLocation();
    setValue(Status);
  };

  useEffect(() => {
    getRunningOrder()
    getDiscount()
  }, [isFocuse])

  const getRunningOrder = () => {
    let obj = {
      onSuccess: () => { },
      onFailure: () => { },
    };
    dispatch(getRunningOrderAction(obj));
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
    getCuisinesList();
    getChefsList();
  }, []);


  const getDiscount = () => {
    let obj = {
      onSuccess: (res: any) => { },
      onFailure: (Err: any) => { },
    };
    dispatch(getDiscountAction(obj));
  }

  const getCuisinesList = () => {
    let obj = {
      data: {
        page: 1,
        limit: 15,
        pagination: false,
      },
      onSuccess: (res: any) => { },
      onFailure: (Err: any) => { },
    };
    dispatch(getCuisinesAction(obj));
  };

  const getChefsList = () => {
    let obj = {
      onSuccess: (res: any) => { },
      onFailure: (Err: any) => { },
    };
    dispatch(getChefsAction(obj));
  };

  const onPressLocation = () => {
    // @ts-ignore
    // navigate(screenName.Map_Location);
    // navigate(screenName.SelectLocation);
  };

  const onOrderCompleted = (id: number) => {
    let UserInfo = {
      data: id,
      onSuccess: () => { },
      onFailure: () => { },
    };
    dispatch(orderCompletedAction(UserInfo));
  }

  const onCancelBtn = (id: number) => {
    let UserInfo = {
      data: id,
      onSuccess: () => { },
      onFailure: () => { },
    };
    dispatch(orderDeclinedAction(UserInfo));
  };


  const renderItem = ({ item, index }) => {
    const formattedDate = formatDate(item.created_at);

    return (
      <View style={styles.listContainer}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.imageView} onPress={() => navigation.navigate(screenName.ChefMyOrders, { itemData: item })}>
            <Text style={styles.imageText}>#{index + 1}</Text>
          </TouchableOpacity>

          <View style={styles.rightContainer}>
            <Text numberOfLines={1} style={styles.breakText}>{`${strings('orderModal.invoice_id')} : ${item.order_id}`}</Text>
            <Text style={styles.titleStyle}>{item.name}</Text>
            {item.table_number !== null ?
              <Text style={styles.idText}>{`${strings('orderModal.table_no')} : ${item.table_number}`}</Text> : null}
            <View style={styles.priceView}>
              <Text style={styles.priceText}>{`₹${item.total}`}</Text>
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.diningView}>
            <Text style={styles.diningText}>{item.order_type === 1 ? strings('orderModal.dining') : strings('orderModal.parcel')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btnContainer}>
          <View style={{ flexDirection: 'row' }}>
            <PrimaryButton
              extraStyle={styles.accpetBtn}
              title={strings('orderModal.completed')}
              titleStyle={styles.accpetText}
              onPress={() => onOrderCompleted(item.id)}
            />
            <Spacer width={16} />
            <PrimaryButton
              extraStyle={styles.cancelBtn}
              title={strings('orderModal.cancel')}
              titleStyle={styles.cancelText}
              onPress={() => onCancelBtn(item.id)}
            />
          </View>
        </View>
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
        onPressProfile={() => { }}
        onPressCart={() => { }}
        location={value}
        onPressLocation={onPressLocation}
        onRightPressNotification={() => {
          navigation.navigate(screenName.ChefNotification);
        }}
      />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={Icons.banner}
          resizeMode="contain"
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT * 0.133,
            marginVertical: 12,
            justifyContent: 'center',
          }}>
          {discount === 0 ? null :
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
            </ImageBackground>}
        </ImageBackground>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: wp(20),
            justifyContent: 'space-between',
            marginTop: hp(8),
            marginBottom: 20,
          }}>
          <Text style={styles.seeText1}>{strings('home.running_orders')}</Text>
          <TouchableOpacity onPress={() => setRunninOrderModal(true)}>
            <Text style={styles.seeText}>{strings('home.see_all')}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={isRunningOrder}
          contentContainerStyle={{ gap: 16, marginHorizontal: wp(20) }}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<NoDataFound />}
        />

        < View style={{ height: 20 }} />

        {
          runningOrderModal && (
            <OrderModal
              isVisible={runningOrderModal}
              onPressCancel={() => setRunninOrderModal(false)}
              isRunning={true}
            />
          )
        }

        {
          orderRequestModal && (
            <OrderModal
              isVisible={orderRequestModal}
              onPressCancel={() => setOrderRequestModal(false)}
            />
          )
        }
      </ScrollView >
    </View >
  );
};

export default ChefHome;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
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
      gap: 18,
      marginVertical: 10,
    },
    headerView: {
      width: '43%',
      height: hp(110),
      marginHorizontal: 0,
      justifyContent: 'center',
    },
    headerText: {
      alignSelf: 'center',
      ...commonFontStyle(700, 52, colors.Title_Text),
    },
    headerSubText: {
      ...commonFontStyle(700, 13, colors.cardText),
      textTransform: 'uppercase',
      alignSelf: 'center',
      marginBottom: 10,
    },
    bannerText: {
      ...commonFontStyle(800, 40, light_theme.white),
      alignSelf: 'center',
      top: 5,
    },
    bannerText1: {
      ...commonFontStyle(700, 20, light_theme.white),
      lineHeight: 20,
      position: 'absolute',
      bottom: -2,
      right: 5,
    },
    seeText: {
      ...commonFontStyle(400, 14, colors.Primary_Orange),
      textDecorationLine: 'underline',
    },
    seeText1: {
      ...commonFontStyle(500, 18, colors.black),
    },

    listContainer: {
      backgroundColor: colors.cards_bg,
      paddingVertical: hp(16),
      paddingHorizontal: wp(16),
      borderRadius: 16,
    },
    imageView: {
      width: wp(70),
      height: hp(70),
      borderRadius: 16,
      backgroundColor: colors.image_bg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageText: {
      ...commonFontStyle(700, 24, colors?.black),
    },
    rightContainer: {
      marginLeft: wp(10),
      flex: 1,
    },
    breakText: {
      ...commonFontStyle(400, 10, colors?.text_orange),
    },
    titleStyle: {
      ...commonFontStyle(600, 14, colors?.black),
    },
    idText: {
      marginTop: hp(2),
      ...commonFontStyle(400, 12, colors?.title_dec),
    },
    priceView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    priceText: {
      ...commonFontStyle(600, 16, colors?.text_orange),
    },
    dateText: {
      ...commonFontStyle(500, 14, colors?.text_gray),
    },
    btnContainer: {},
    doneBtn: {
      height: hp(36),
      paddingHorizontal: wp(13),
      borderRadius: 9,
    },
    doneText: {
      ...commonFontStyle(400, 14, colors?.white),
      textTransform: 'none',
    },
    accpetBtn: {
      flex: 1,
      height: hp(34),
      marginTop: hp(16),
      backgroundColor: colors.text_orange,
      borderColor: colors.text_orange,
      borderWidth: 1,
      borderRadius: 8,
    },
    accpetText: {
      ...commonFontStyle(600, 14, colors?.defult_white),
      textTransform: 'none',
    },
    cancelBtn: {
      flex: 1,
      height: hp(34),
      marginTop: hp(16),
      backgroundColor: colors.cards_bg,
      borderColor: colors.title_dec,
      borderWidth: 1,
      borderRadius: 8,
    },
    cancelText: {
      ...commonFontStyle(600, 14, colors?.title_dec),
      textTransform: 'none',
    },
    dropDownStyle: {
      borderColor: colors.border_line4,
      width: wp(120),
      height: hp(30),
      borderRadius: 5,
    },
    diningView: {
      position: 'absolute',
      top: -2,
      right: 0,
      backgroundColor: colors.text_orange,
      paddingHorizontal: wp(6),
      paddingVertical: hp(2),
      borderRadius: 16,
    },
    diningText: {
      ...commonFontStyle(500, 12, colors?.defult_white),
    },
  });
};
