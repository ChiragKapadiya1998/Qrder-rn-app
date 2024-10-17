import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import HomeHeader from '../../compoment/HomeHeader';
import {strings} from '../../i18n/i18n';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import ThankYouModal from '../../compoment/ThankYouModal';
import {
  allMyOrderAction,
  invoiceLinkAction,
} from '../../actions/allOrdersAction';
import {GET_ALL_MY_ORDER} from '../../redux/actionTypes';
import {
  calculateTotalMiscAmount,
  calculateTotalTax,
  convertIsoToDate,
  formatDate,
} from '../../utils/globalFunctions';
import NoDataFound from '../../compoment/NoDataFound';

const MyOrderAdmin = () => {
  const {colors} = useTheme();
  const route = useRoute();
  const {itemData} = route?.params;
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const navigation = useNavigation();
  const {isDarkTheme} = useAppSelector(state => state.common);
  const {allMyOrder} = useAppSelector(state => state.orders);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const dispatch = useAppDispatch();
  const [myOrderData, setMyOrderData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const goback = () => {
    navigation.goBack();
    dispatch({type: GET_ALL_MY_ORDER, payload: []});
    setMyOrderData({});
  };

  useEffect(() => {
    getAllMyOrder();
  }, []);

  const getAllMyOrder = () => {
    let UserInfo = {
      data: itemData?.id,
      onSuccess: res => {
        setMyOrderData(res);
        setIsLoading(false);
      },
      onFailure: () => {
        setIsLoading(false);
      },
    };
    dispatch(allMyOrderAction(UserInfo));
  };

  const onPressGoToHome = () => {
    setIsOpenModal(false);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const onPressInvoice = () => {
    let obj = {
      params: itemData?.id,
      onSuccess: res => {
        Linking.openURL(res.url);
      },
      onFailure: () => {},
    };
    dispatch(invoiceLinkAction(obj));
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
          onPressInvoice();
          // setIsOpenModal(true);
        }}
        mainShow={true}
        title={strings('myOrders.my_orders')}
        extraStyle={styles.headerContainer}
        createText={strings('profileScreen.download_invoice')}
        isShowIcon={false}
        isCreateIcon={true}
        isShowInvoice={true}
      />
      <ScrollView
        style={styles.subContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.orederText}>
          {strings('myOrders.order_details')}
        </Text>
        <View style={styles.orderBox}>
          <View style={[styles.comanStyle]}>
            <Text style={styles.priText}>
              {strings('newAddText.invoice_Ids')}
            </Text>
            <Text style={[styles.priText, {color: colors.black}]}>
              {allMyOrder?.order_id}
            </Text>
          </View>
          <View style={[styles.comanStyle, {marginVertical: hp(12)}]}>
            <Text style={styles.priText}>
              {strings('CuisinesNameList.names')}
            </Text>
            <Text style={[styles.priText, {color: colors.black}]}>
              {allMyOrder?.name}
            </Text>
          </View>
          <View style={styles.comanStyle}>
            <Text style={styles.priText}>
              {strings('myOrders.phone_number')}
            </Text>
            <Text style={[styles.priText, {color: colors.black}]}>
              {allMyOrder?.number}
            </Text>
          </View>
          <View style={[styles.comanStyle, {marginTop: hp(12)}]}>
            <Text style={styles.priText}>{strings('sign_up.e_emaild')}</Text>
            <Text style={[styles.priText, {color: colors.black}]}>
              {allMyOrder?.email}
            </Text>
          </View>
          <View style={[styles.comanStyle, {marginVertical: hp(12)}]}>
            <Text style={styles.priText}>{strings('myOrders.subtotal')}</Text>
            <Text
              style={[
                styles.priText,
                {color: colors.black},
              ]}>{`₹${allMyOrder?.subtotal}`}</Text>
          </View>
          <View style={[styles.comanStyle]}>
            <Text style={styles.priText}>{strings('myOrders.discount')}</Text>
            <Text
              style={[
                styles.priText,
                {color: colors.red_text},
              ]}>{`-₹${allMyOrder?.discount}`}</Text>
          </View>
          {/* <View style={[styles.comanStyle, {marginTop: hp(12)}]}>
            <Text style={styles.priText}>
              {strings('newAddText.total_misc')}
            </Text>
            <Text style={[styles.priText, {color: colors.black}]}>
              {`₹${calculateTotalMiscAmount(allMyOrder?.items)}`}
            </Text>
          </View>
          <View style={[styles.comanStyle, {marginVertical: hp(12)}]}>
            <Text style={styles.priText}>
              {strings('newAddText.total_tax')}
            </Text>
            <Text
              style={[
                styles.priText,
                {color: colors.black},
              ]}>{`₹${calculateTotalTax(allMyOrder?.items)}`}</Text>
          </View> */}
          <View style={[styles.comanStyle,{marginTop:hp(12)}]}>
            <Text style={styles.priText}>
              {strings('myOrders.platform_free')}
            </Text>
            <Text
              style={[styles.priText, {color: colors.black}]}>{`₹${2}`}</Text>
          </View>
          <View style={[styles.comanStyle, {marginTop: hp(12)}]}>
            <Text style={styles.priText}>
              {strings('myOrders.created_date')}
            </Text>
            <Text style={[styles.priText, {color: colors.green_text}]}>
              {convertIsoToDate(allMyOrder?.created_at)}
            </Text>
          </View>
          <View style={styles.borderLine} />
          <View style={styles.comanStyle}>
            <Text style={styles.priText}>{strings('foodCart.total_pay')}</Text>
            <Text style={styles.totalPrice}>{`₹${allMyOrder?.total}`}</Text>
          </View>
        </View>

        <Text style={[styles.addressText]}>{strings('myOrders.items')}</Text>
        {!isLoading && allMyOrder?.items && (
          <FlatList
            data={allMyOrder.items}
            renderItem={({item}) => {
              const miscItems = item.miscellaneous_items
                .map(misc => misc.name)
                .join(', ');
              const miscAmount = item.miscellaneous_items
                .reduce((total, misc) => total + parseFloat(misc.price), 0)
                .toFixed(2);

              const taxAmount =
                item?.menu?.price * (item?.menu?.tax_percentage / 100);

              return (
                <View style={styles.headingView}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={{uri: item?.menu?.image}}
                      style={styles.imageStyle}
                    />
                    <View style={{marginLeft: wp(10), flex: 1}}>
                      <Text style={styles.foodText}>{item?.menu?.name}</Text>
                      {item?.description !== null ? (
                        <Text style={styles.desText}>
                          {`${strings('addFoodList.Description')} : `}
                          <Text numberOfLines={1} style={styles.leftText}>
                            {item?.description}
                          </Text>
                        </Text>
                      ) : null}

                      <Text style={styles.desText}>
                        {`${strings('newAddText.quantity')} : `}
                        <Text numberOfLines={1} style={styles.leftText}>
                          {item?.quantity}
                        </Text>
                      </Text>
                      {miscItems.length === 0 ? null : (
                        <Text style={styles.desText}>
                          {`${strings('newAddText.misc_item')} : `}
                          <Text numberOfLines={1} style={styles.leftText}>
                            {miscItems}
                          </Text>
                        </Text>
                      )}
                      {parseFloat(miscAmount) > 0 ? (
                        <Text style={styles.desText}>
                          {`${strings('newAddText.misc_amount')} : `}
                          <Text numberOfLines={1} style={styles.leftText}>
                            {miscAmount}
                          </Text>
                        </Text>
                      ) : null}
                      {taxAmount > 0 ? (
                        <Text style={styles.desText}>
                          {`${strings('newAddText.tax')} : `}
                          <Text numberOfLines={1} style={styles.leftText}>
                            {taxAmount}
                          </Text>
                        </Text>
                      ) : null}

                      <View style={styles.addContiner}>
                        <Text style={styles.priceText}>
                          ₹{item?.menu?.price}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
            keyExtractor={item => item.toString()}
            contentContainerStyle={styles.containerView}
            ListEmptyComponent={<NoDataFound />}
          />
        )}
      </ScrollView>
      <ThankYouModal
        title={strings('myOrders.thank_you_des')}
        title1={strings('myOrders.thank_you')}
        rightText={strings('myOrders.go_to_home')}
        visible={isOpenModal}
        closeModal={() => closeModal()}
        onPressGoToHome={() => onPressGoToHome()}
      />
    </View>
  );
};
export default MyOrderAdmin;

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg_white,
    },
    headerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    subContainer: {
      marginHorizontal: wp(20),
    },
    orederText: {
      ...commonFontStyle(600, 18, colors.black),
    },
    orderBox: {
      backgroundColor: colors.cards_bg,
      paddingHorizontal: wp(16),
      paddingVertical: hp(16),
      borderRadius: 16,
      marginTop: hp(8),
    },
    summaryText: {
      ...commonFontStyle(600, 18, colors.black),
    },
    priText: {
      ...commonFontStyle(500, 14, colors.title_dec100),
    },
    totalPrice: {
      ...commonFontStyle(600, 20, colors.text_orange),
    },
    borderLine: {
      borderBottomColor: colors.text_gray,
      borderBottomWidth: 1,
      borderStyle: 'dashed',
      marginVertical: hp(12),
    },
    comanStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    addressText: {
      marginTop: hp(20),
      ...commonFontStyle(600, 18, colors.black),
    },
    cardContainer: {
      backgroundColor: colors.cards_bg,
      padding: 16,
      borderRadius: 16,
      marginTop: hp(8),
    },
    boxView: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    textStyle: {
      ...commonFontStyle(500, 14, colors.title_dec100),
    },
    nameText: {
      ...commonFontStyle(600, 14, colors.black),
    },
    diningView: {
      backgroundColor: colors.text_orange,
      paddingHorizontal: wp(6),
      paddingVertical: hp(2),
      borderRadius: 16,
    },
    diningText: {
      ...commonFontStyle(500, 10, colors.defult_white),
    },
    containerView: {
      gap: 20,
      marginTop: hp(20),
    },
    headingView: {
      backgroundColor: colors.cards_bg,
      borderRadius: 16,
      paddingVertical: hp(10),
      paddingHorizontal: wp(16),
    },
    imageStyle: {
      width: 89,
      height: 89,
      borderRadius: 16,
      resizeMode: 'stretch',
    },
    itemText: {
      ...commonFontStyle(400, 10, colors.text_orange),
    },
    foodText: {
      ...commonFontStyle(600, 14, colors.black),
    },
    addContiner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: hp(3),
    },
    priceText: {
      ...commonFontStyle(600, 16, colors.text_orange),
    },
    leftText: {
      ...commonFontStyle(400, 10, colors.title_dec100),
    },
    desText: {
      ...commonFontStyle(400, 10, colors.text_orange),
    },
  });
};
