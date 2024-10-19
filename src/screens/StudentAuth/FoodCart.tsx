import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation, useTheme} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import HomeHeader from '../../compoment/HomeHeader';
import {strings} from '../../i18n/i18n';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {Icons} from '../../utils/images';
import Input from '../../compoment/Input';
import PrimaryButton from '../../compoment/PrimaryButton';
import {
  deleteCardAction,
  getCardAction,
  orderCreateAction,
  updateQuantityAction,
} from '../../actions/cardAction';
import {
  decrement,
  getDiscountAction,
  getRestaurantDiscountAction,
  increment,
} from '../../actions/commonAction';
import {errorToast} from '../../utils/commonFunction';
import {screenName} from '../../navigation/screenNames';

const FoodCart = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const {getCardData} = useAppSelector(state => state.data);
  const {isDarkTheme, discount} = useAppSelector(state => state.common);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const isFocuse = useIsFocused();

  const totalPrice = getCardData.reduce((acc, item) => {
    return acc + Number(item.price) * item.quantity;
  }, 0);

  let miscellaneousItemsPrice = 0;
  let platformPrice = 2;

  getCardData?.forEach(order => {
    order.miscellaneous_items.forEach(item => {
      miscellaneousItemsPrice += parseFloat(item.miscellaneous_item.price);
    });
  });

  let discontData =
    discount == 0
      ? 0
      : (miscellaneousItemsPrice + totalPrice + platformPrice) *
        (discount / 100);

  const deleteCardItem = (id: number) => {
    let cardInfo = {
      data: id,
      onSuccess: () => {
        let obj = {
          onSuccess: () => {},
          onFailure: () => {},
        };
        dispatch(getCardAction(obj));
      },
      onFailure: (Err: any) => {
        if (Err != undefined) {
          Alert.alert('Warning', Err?.message);
        }
      },
    };
    dispatch(deleteCardAction(cardInfo));
  };

  const incrementQuenty = (cardId: number, item) => {
    let updateObj = {
      data: {
        quantity: item?.quantity + 1,
      },
      params: cardId,
      onSuccess: (res: any) => {
        dispatch(increment(res.data?.menu_id));
      },
      onFailure: (Err: any) => {
        if (Err != undefined) {
          Alert.alert('Warning', Err?.message);
        }
      },
    };
    dispatch(updateQuantityAction(updateObj));
  };

  const decrementQuenty = (cardId: number, item) => {
    let updateObj = {
      data: {
        quantity: item?.quantity - 1,
      },
      params: cardId,
      onSuccess: (res: any) => {
        dispatch(decrement(res.data?.menu_id));
      },
      onFailure: (Err: any) => {
        if (Err != undefined) {
          Alert.alert('Warning', Err?.message);
        }
      },
    };
    dispatch(updateQuantityAction(updateObj));
  };
  const payNowPress = (cardId: number, item) => {
    if (address == '') {
      errorToast(strings('login.error_address'));
    } else {
      setLoading(true);
      let data = new FormData();
      data.append('address', address);
      data.append('order_type', '');
      data.append(
        'sub_total',
        (miscellaneousItemsPrice + totalPrice).toFixed(2),
      );
      data.append('table_number', '');

      let updateObj = {
        data,
        onSuccess: (res: any) => {
          setAddress('');
          setLoading(false);
          navigation.navigate(screenName.student_tab_bar.StudentHome);
        },
        onFailure: (Err: any) => {
          setLoading(false);
          if (Err != undefined) {
            Alert.alert('Warning', Err?.message);
          }
        },
      };
      dispatch(orderCreateAction(updateObj));
    }
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
          navigation.navigate('FoodCart');
        }}
        mainShow={true}
        title={strings('foodDetails.food_cart')}
        extraStyle={styles.headerContainer}
        isHideIcon={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp(100)}}>
        <FlatList
          data={getCardData}
          renderItem={({item}) => (
            <View style={styles.headingView}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{uri: item?.menu?.image}}
                  style={styles.imageStyle}
                />
                <View style={{marginLeft: wp(10), flex: 1}}>
                  <Text style={styles.titleText}>{item?.name}</Text>
                  {/* <TouchableOpacity
                    style={styles.closeView}
                    onPress={() => deleteCardItem(item?.id)}>
                    <Image style={styles.closeIcon} source={Icons.deleteMins} />
                  </TouchableOpacity> */}
                  <Text numberOfLines={1} style={styles.leftText}>
                    {item?.description}
                  </Text>
                  <View style={styles.addContiner}>
                    <Text style={styles.priceText}>{`₹${parseFloat(
                      item.price,
                    ).toString()}`}</Text>
                    <View style={styles.addItemView}>
                      <TouchableOpacity
                        onPress={() => {
                          if (item?.quantity > 1) {
                            decrementQuenty(item?.id, item);
                          } else {
                            deleteCardItem(item?.id);
                          }
                        }}>
                        <Image
                          source={
                            item?.quantity > 1 ? Icons.minus : Icons.deleteMins
                          }
                          style={styles.decrementIcons}
                        />
                      </TouchableOpacity>
                      <Text style={styles.countText}>{item?.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          incrementQuenty(item?.id, item);
                        }}>
                        <Image source={Icons.plus} style={styles.plusIcons} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
          keyExtractor={item => item.toString()}
          contentContainerStyle={styles.containerView}
        />

        {/* Summary Section */}
        <View style={{paddingHorizontal: wp(20), marginTop: hp(16)}}>
          <Text style={styles.summaryText}>{strings('foodCart.summary')}</Text>
          <View style={[styles.comanStyle, {marginTop: hp(8)}]}>
            <Text style={styles.priText}>{strings('myOrders.subtotal')}</Text>
            <Text style={[styles.priText, {color: colors.black}]}>{`₹${(
              miscellaneousItemsPrice + totalPrice
            ).toFixed(2)}`}</Text>
          </View>
          {/* <View style={[styles.comanStyle, {marginVertical: hp(12)}]}>
            <Text style={styles.priText}>{strings('foodCart.Tax')}</Text>
            <Text style={[styles.priText, {color: colors.black}]}>
              {platformPrice}
            </Text>
          </View> */}
          <View style={[styles.comanStyle, {marginTop: hp(12)}]}>
            <Text style={styles.priText}>
              {strings('foodCart.Platform_Fee')}
            </Text>
            <Text style={[styles.priText, {color: colors.black}]}>
              {`₹${platformPrice}`}
            </Text>
          </View>
          <View style={[styles.comanStyle, {marginVertical: hp(12)}]}>
            <Text style={styles.priText}>{`${strings(
              'foodCart.discount',
            )} (${discount}%)`}</Text>
            <Text style={[styles.priText, {color: colors.black}]}>
              {discount == 0 ? 0 : `- ₹${discontData.toFixed(2)}`}
            </Text>
          </View>

          {/* <View style={styles.comanStyle}>
            <Text style={styles.priText}>
              {strings('foodCart.delivery_charge')}
            </Text>
            <Text style={[styles.priText, {color: colors.green_text}]}>
              {strings('foodCart.free_delivery')}
            </Text>
          </View> */}
          <View style={styles.borderLine} />
          <View style={styles.comanStyle}>
            <Text style={styles.priText}>{strings('foodCart.total_pay')}</Text>
            <Text style={styles.totalPrice}>
              {`₹${(
                miscellaneousItemsPrice +
                platformPrice +
                totalPrice -
                discontData
              ).toFixed(2)}`}
            </Text>
          </View>

          {/* Address Input */}
          <Input
            value={address}
            placeholder={strings('sign_up.add_address')}
            label={strings('sign_up.address')}
            onChangeText={t => setAddress(t)}
            isShowLabel={true}
            inputStyle={styles.inputStyle}
          />
        </View>
      </ScrollView>

      {/* Fixed Pay Now Button */}
      {getCardData.length !== 0 && (
        <View style={styles.fixedButtonContainer}>
          <PrimaryButton
            extraStyle={styles.submitButton}
            title={strings('sign_up.pay_now')}
            titleStyle={styles.submitText}
            isLoading={loading}
            onPress={payNowPress}
          />
        </View>
      )}
    </View>
  );
};

export default FoodCart;

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors?.bg_white,
    },
    containerView: {
      marginHorizontal: wp(20),
      gap: 16,
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
    foodText: {
      ...commonFontStyle(600, 14, colors.black),
    },
    addContiner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: hp(10),
    },
    priceText: {
      ...commonFontStyle(600, 16, colors.text_orange),
    },
    leftText: {
      ...commonFontStyle(500, 12, colors.title_dec100),
    },
    addItemView: {
      height: hp(32),
      borderColor: colors.text_orange,
      borderWidth: 1,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      paddingHorizontal: wp(10),
    },
    countText: {
      marginHorizontal: wp(10),
      ...commonFontStyle(600, 14, colors.black),
    },
    decrementIcons: {
      width: 18,
      height: 18,
      resizeMode: 'contain',
      tintColor: colors.text_orange,
    },
    plusIcons: {
      width: 12,
      height: 12,
      resizeMode: 'contain',
      tintColor: colors.text_orange,
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
    inputStyle: {
      borderColor: colors.text_orange,
    },
    fixedButtonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: wp(20),
      paddingVertical: hp(10),
      backgroundColor: colors.bg_white,
    },
    submitButton: {
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitText: {
      ...commonFontStyle(600, 18, colors.defult_white),
    },
    titleText: {
      ...commonFontStyle(600, 14, colors.black),
    },
    closeView: {
      position: 'absolute',
      right: 0,
      top: -8,
      width: 24,
      height: 24,
      borderRadius: 5,
      backgroundColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeIcon: {
      width: 18,
      height: 18,
      resizeMode: 'contain',
      tintColor: colors.text_orange,
    },
  });
};
