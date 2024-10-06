//import liraries
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ReactNativeModal from 'react-native-modal';
import {SCREEN_HEIGHT, commonFontStyle, hp, wp} from '../theme/fonts';
import {useIsFocused, useNavigation, useTheme} from '@react-navigation/native';
import PrimaryButton from './PrimaryButton';
import {strings} from '../i18n/i18n';
import CCDropDown from './CCDropDown';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import Spacer from './Spacer';
import {formatDate} from '../utils/globalFunctions';
import {
  getOrdersRequestAction,
  getRunningOrderAction,
  orderCompletedAction,
  orderDeclinedAction,
  orderRequestAccpet,
} from '../actions/allOrdersAction';
import NoDataFound from './NoDataFound';
import {screenName} from '../navigation/screenNames';

export type OrderModal = {
  isVisible: boolean;
  title: string;
  question: string;
  onPressYes: () => void;
  onPressCancel: () => void;
  isRunning?: boolean;
};

const OrderModal = ({
  isVisible,
  title,
  question,
  onPressCancel,
  onPressYes,
  isRunning = false,
}: OrderModal) => {
  const {colors} = useTheme();
  const dispatch = useAppDispatch();
  const isFocuse = useIsFocused();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const {isRunningOrder, isOrderRequest} = useAppSelector(
    state => state.orders,
  );
  const navigation = useNavigation();

  useEffect(() => {
    getRunningOrder();
    getOrderRequest();
  }, [isFocuse]);

  const getRunningOrder = () => {
    let obj = {
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getRunningOrderAction(obj));
  };

  const getOrderRequest = () => {
    let obj = {
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getOrdersRequestAction(obj));
  };

  const onOrderAccpet = (id: number) => {
    let UserInfo = {
      data: id,
      onSuccess: (res: any) => {},
      onFailure: (Err: any) => {},
    };
    dispatch(orderRequestAccpet(UserInfo));
  };

  const onOrderCompleted = (id: number) => {
    let UserInfo = {
      data: id,
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(orderCompletedAction(UserInfo));
  };

  const onCancelBtn = (id: number) => {
    let UserInfo = {
      data: id,
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(orderDeclinedAction(UserInfo));
  };
  const onPressOrder = item => {
    navigation.navigate(screenName.MyOrders, {itemData: item});
    onPressCancel();
  };

  const renderItem = ({item, index}) => {
    const formattedDate = formatDate(item.created_at);

    return (
      <View style={styles.listContainer}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => onPressOrder(item)}
            style={styles.imageView}>
            <Text style={styles.imageText}>#{index + 1}</Text>
          </TouchableOpacity>

          <View style={styles.rightContainer}>
            <Text numberOfLines={1} style={styles.breakText}>{`${strings(
              'orderModal.invoice_id',
            )} : ${item.order_id}`}</Text>
            <Text style={styles.titleStyle}>{item.name}</Text>
            {item.table_number !== null ? (
              <Text style={styles.idText}>{`${strings(
                'orderModal.table_no',
              )} : ${item.table_number}`}</Text>
            ) : null}
            <View style={styles.priceView}>
              <Text style={styles.priceText}>{`₹${item.total}`}</Text>
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.diningView}>
            <Text style={styles.diningText}>
              {item.order_type === 1
                ? strings('orderModal.dining')
                : strings('orderModal.parcel')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btnContainer}>
          {isRunning ? (
            <View style={{flexDirection: 'row'}}>
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
          ) : (
            <View style={{flexDirection: 'row'}}>
              <PrimaryButton
                extraStyle={styles.accpetBtn}
                title={strings('orderModal.accpet')}
                titleStyle={styles.accpetText}
                onPress={() => onOrderAccpet(item.id)}
              />
              <Spacer width={16} />
              <PrimaryButton
                extraStyle={styles.cancelBtn}
                title={strings('orderModal.declined')}
                titleStyle={styles.cancelText}
                onPress={() => onCancelBtn(item.id)}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <ReactNativeModal
      isVisible={isVisible}
      statusBarTranslucentss
      animationIn={'fadeInUpBig'}
      animationInTiming={1000}
      animationOutTiming={1000}
      onBackButtonPress={onPressCancel}
      onBackdropPress={onPressCancel}
      style={{justifyContent: 'flex-end', margin: 0}}>
      <View style={styles.container}>
        <View style={styles.lineStyle} />
        <View style={styles.headerView}>
          <Text style={styles.titleText}>
            {isRunning
              ? `${strings('orderModal.running_orders')}`
              : `${
                  isOrderRequest?.length ? isOrderRequest?.length : ''
                } ${strings('orderModal.order_request')}`}
          </Text>

          <FlatList
            data={isRunning ? isRunningOrder : isOrderRequest}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{height: 60}} />}
            ListEmptyComponent={<NoDataFound />}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
};

const getGlobalStyles = (props: any) => {
  const {colors} = props;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.bg_white,
      height: SCREEN_HEIGHT * 0.8,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },
    lineStyle: {
      width: wp(40),
      height: hp(4),
      backgroundColor: colors.text_gray,
      alignSelf: 'center',
      marginTop: hp(16),
      borderRadius: 5,
    },
    headerView: {
      paddingTop: hp(16),
      paddingHorizontal: wp(20),
    },
    titleText: {
      ...commonFontStyle(500, 20, colors?.black),
      marginBottom: hp(4),
    },
    listContainer: {
      marginTop: hp(16),
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

export default OrderModal;
