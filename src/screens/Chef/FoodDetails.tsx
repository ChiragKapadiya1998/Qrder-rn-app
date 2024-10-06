import {
  Alert,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {
  commonFontStyle,
  hp,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  wp,
} from '../../theme/fonts';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {strings} from '../../i18n/i18n';
import HomeHeader from '../../compoment/HomeHeader';
import Swiper from 'react-native-swiper';
import {Icons} from '../../utils/images';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {screenName} from '../../navigation/screenNames';
import PrimaryButton from '../../compoment/PrimaryButton';
import {
  addCardAction,
  getCardAction,
  updateQuantityAction,
} from '../../actions/cardAction';
import {errorToast, miscellData} from '../../utils/commonFunction';
import Spacer from '../../compoment/Spacer';

const FoodDetails = ({route}) => {
  const {itemData, showChef, showAddToCard} = route?.params;
  const {colors} = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const {isDarkTheme} = useAppSelector(state => state.common);
  const [basicDetails, setBasicDetails] = useState('');
  const {name, price, cuisine_name, description, id, image} = itemData;
  const [selectedItems, setSelectedItems] = useState([]);
  const [foodDelivery, setFoodDelivery] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(price);
  const [activeButton, setActiveButton] = useState('increment');

  useEffect(() => {
    setTotalPrice(quantity * price);
  }, [quantity, price]);

  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
    setActiveButton('increment');
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
      setActiveButton('decrement');
    } else {
      errorToast(strings('foodDetails.e_decrement'));
      setActiveButton('increment');
    }
  };

  const toggleSelection = list => {
    if (selectedItems.some(item => item.id === list.id)) {
      setSelectedItems(prevSelected =>
        prevSelected.filter(item => item.id !== list.id),
      );
    } else {
      setSelectedItems(prevSelected => [
        ...prevSelected,
        {id: list.id, quantity: 1, price: list.price},
      ]);
    }
  };

  const miscellPrices = useMemo(() => {
    return selectedItems.reduce((total, item) => {
      return total + parseFloat(item.price) * item.quantity;
    }, 0);
  }, [selectedItems]);

  const onPressAddCard = () => {
    if (foodDelivery.trim().length === 0) {
      errorToast(strings('foodDetails.e_food_customization'));
    } else {
      let obj = {
        data: {
          menu_id: id,
          quantity: quantity,
          description: foodDelivery,
          miscellaneous_items: selectedItems,
        },
        onSuccess: () => {
          let obj = {
            onSuccess: () => {
              setFoodDelivery('');
              setQuantity(1);
              setActiveButton('increment');
              setSelectedItems([]);
            },
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
      dispatch(addCardAction(obj));
    }
  };

  const renderItem = ({item}) => {
    const isSelected = selectedItems.some(
      selectedItem => selectedItem.id === item.id,
    );
    const selectColor = isSelected ? colors.text_orange : colors.title_dec100;
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => toggleSelection(item)}>
          <View
            style={[
              styles.checkbox,
              {backgroundColor: isSelected ? colors.blue : 'transparent'},
            ]}>
            {isSelected && (
              <Image source={Icons.ic_check} style={styles.ic_check} />
            )}
          </View>
          <Text style={[styles.text1, {color: selectColor}]}>{item.name}</Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.priceTextStyle,
            {color: selectColor},
          ]}>{`₹${item.price}`}</Text>
      </View>
    );
  };

  const total = miscellPrices + totalPrice;
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
          navigation.navigate(screenName.FoodCart);
          // navigation.navigate(screenName.EditFoodDetails, { itemData: itemData })
        }}
        mainShow={true}
        title={name || strings('foodDetails.food_Details')}
        extraStyle={styles.headerContainer}
        isHideIcon={showAddToCard ? false : true}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Image source={{uri: image}} style={styles.imageStyle} />
        </View>
        <View style={styles.headingView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.foodText}>{name}</Text>
            {/* <View style={styles.rateView}>
              <Image source={Icons.star} style={styles.starStyle} />
              <Text style={styles.rateText}>4.9</Text>
            </View> */}
          </View>
          {cuisine_name ? (
            <Text style={styles.leftText}>{cuisine_name}</Text>
          ) : (
            ''
          )}
          <Text style={styles.priceText}>{`₹${price}`}</Text>
          {showAddToCard ? (
            <View style={styles.addItemView}>
              <TouchableOpacity onPress={decrementQuantity}>
                <Image
                  source={Icons.decrementIcon}
                  style={[
                    styles.decrementIcons,
                    {
                      tintColor:
                        activeButton === 'decrement'
                          ? colors.text_orange
                          : colors.title_dec100,
                    },
                  ]}
                />
              </TouchableOpacity>

              <Text style={styles.countText}>{quantity}</Text>
              <TouchableOpacity onPress={incrementQuantity}>
                <Image
                  source={Icons.incrementIcon}
                  style={[
                    styles.decrementIcons,
                    {
                      tintColor:
                        activeButton === 'increment'
                          ? colors.text_orange
                          : colors.title_dec100,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        {/* <View style={styles.mainConatiner}>
          <Swiper
            showsPagination={true}
            autoplay={true}
            horizontal={true}
            paginationStyle={{ height: 10 }}
            height="auto"
            dot={
              <>
                <View style={styles.dot} />
                <View style={styles.leftView}>
                  <Text style={styles.leftText}>{cuisine_name}</Text>
                </View>
              </>
            }
            activeDot={
              <>
                <View style={styles.activateDot} />
              </>
            }>
            {[1, 1, 2, 3].map(() => {
              return (
                <>
                  <View style={styles.slide}>
                    <Image source={Icons.slider1} style={styles.imageStyle} />
                  </View>
                </>
              );
            })}
          </Swiper>
        </View> */}
        <Text style={styles.basicText}>
          {strings('addFoodList.Description')}
        </Text>
        <TextInput
          value={description}
          onChangeText={(t: string) => setBasicDetails(t)}
          placeholder={strings('addFoodList.add_basic')}
          style={styles.basicInput}
          multiline
          maxLength={200}
          editable={false}
          placeholderTextColor={colors.black}
        />

        <Text style={styles.miscellText}>
          {strings('addFoodList.Miscellaneousitems')}
        </Text>
        {itemData?.miscellaneous_items ? (
          <FlatList
            data={itemData?.miscellaneous_items}
            renderItem={renderItem}
            contentContainerStyle={{gap: 10}}
            keyExtractor={item => item.id}
          />
        ) : null}

        {!showChef && !showAddToCard && (
          <>
            <Text style={styles.foodReviewText}>
              {strings('addFoodList.food_review')}
            </Text>
            <PrimaryButton
              extraStyle={styles.reviewButton}
              onPress={onPressAddCard}
              title={strings('addFoodList.give_food_rating')}
              titleStyle={styles.reviewText}
            />
          </>
        )}
        {showAddToCard && (
          <>
            <Text style={styles.foodReviewText}>
              {strings('foodDetails.Food_customization')}
            </Text>
            <TextInput
              value={foodDelivery}
              onChangeText={(t: string) => setFoodDelivery(t)}
              placeholder={strings('supportText.enter_text')}
              style={[
                styles.basicInput1,
                {
                  borderColor:
                    foodDelivery?.length == 0
                      ? colors.border
                      : colors.text_orange,
                },
              ]}
              multiline
              maxLength={200}
              placeholderTextColor={colors.text_gray}
            />
          </>
        )}
        {/* {showAddToCard ? (
          <PrimaryButton
            extraStyle={styles.addButton}
            onPress={onPressAddCard}
            title={strings('addFoodList.add_to_card')}
          />
        ) : null} */}
        <Spacer height={20} />
      </KeyboardAwareScrollView>
      {showAddToCard ? (
        <View style={styles.buyNowView}>
          <View>
            <Text style={styles.pricesText}>
              {strings('addFoodList.price')}
            </Text>
            <Text style={styles.prText}>{`₹${total}`}</Text>
          </View>
          <PrimaryButton
            extraStyle={styles.buyNowBtn}
            onPress={onPressAddCard}
            title={strings('addFoodList.buy_now')}
            titleStyle={styles.buyNowText}
          />
        </View>
      ) : null}
    </View>
  );
};

export default FoodDetails;

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg_white,
    },
    contentContainerStyle: {
      marginHorizontal: wp(20),
    },
    headerContainer: {
      backgroundColor: colors.bg_white,
    },
    foodTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    foodText: {
      ...commonFontStyle(700, 16, colors.black),
    },
    priceText: {
      marginTop: hp(5),
      ...commonFontStyle(700, 20, colors.text_orange),
    },
    rateView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: wp(8),
    },
    starStyle: {
      width: 17,
      height: 17,
      resizeMode: 'contain',
    },
    rateText: {
      marginLeft: 4,
      ...commonFontStyle(600, 16, colors.black),
    },
    rateText1: {
      ...commonFontStyle(400, 14, colors.tabBar),
      marginLeft: 6,
    },
    underlineAll: {
      height: 1,
      width: SCREEN_WIDTH,
      backgroundColor: colors.border_line5,
      marginTop: hp(24),
    },
    basicText: {
      ...commonFontStyle(500, 18, colors.black),
    },
    basicInput: {
      // height: hp(100),
      borderRadius: 16,
      padding: 16,
      textAlignVertical: 'top',
      marginTop: hp(8),
      color: colors.black,
      backgroundColor: colors.cards_bg,
    },
    miscellText: {
      marginTop: hp(16),
      marginBottom: hp(8),
      ...commonFontStyle(500, 18, colors.black),
    },
    ic_check: {
      width: 11,
      height: 11,
    },
    text1: {
      ...commonFontStyle(500, 14, colors.title_dec100),
    },
    priceTextStyle: {
      ...commonFontStyle(600, 14, colors.text_orange),
    },
    descriptionText: {
      marginTop: 15,
      ...commonFontStyle(400, 14, colors.Title_Text),
    },
    descriptionText1: {
      marginTop: 15,
      ...commonFontStyle(400, 13, colors.text_color),
    },
    mainConatiner: {
      marginTop: 18,
      //   paddingHorizontal: 12,
      marginBottom: 12,
    },
    slide: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    imageStyle: {
      // width:wp(210),
      // height: hp(220),
      resizeMode: 'cover',
      borderRadius: 16,
      height: SCREEN_HEIGHT * 0.27,
      width: SCREEN_WIDTH * 0.56,
    },
    headingView: {
      backgroundColor: colors.cards_bg,
      borderRadius: 16,
      paddingVertical: hp(16),
      paddingHorizontal: wp(16),
      marginVertical: hp(16),
    },
    activateDot: {
      backgroundColor: colors.white,
      width: 21,
      height: 10,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
      top: 10,
    },
    dot: {
      backgroundColor: 'rgba(0,0,0,.2)',
      width: 10,
      height: 10,
      borderRadius: 10,
      marginLeft: 3,
      marginRight: 3,
      top: 10,
    },
    leftView: {
      position: 'absolute',
      left: 12,
      backgroundColor: colors.white,
      borderRadius: 18,
      paddingVertical: 5,
      paddingHorizontal: 16,
    },
    rightView: {
      position: 'absolute',
      right: 10,
      backgroundColor: colors.white,
      borderRadius: 18,
      paddingVertical: 5,
      paddingHorizontal: 16,
    },
    leftText: {
      ...commonFontStyle(500, 12, colors.title_dec100),
    },
    addItemView: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      bottom: 25,
      right: 16,
    },
    decrementIcons: {
      width: 25,
      height: 25,
      resizeMode: 'contain',
    },
    countText: {
      marginHorizontal: wp(10),
      ...commonFontStyle(600, 14, colors.text_orange),
    },
    addButton: {
      height: hp(50),
      marginTop: hp(30),
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    checkbox: {
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3,
      borderWidth: 1,
      borderColor: colors.title_dec100,
    },
    foodReviewText: {
      marginTop: hp(16),
      ...commonFontStyle(500, 18, colors.black),
    },
    reviewButton: {
      height: hp(44),
      marginTop: hp(20),
      backgroundColor: colors.bg_white,
      borderColor: colors.text_orange,
      borderWidth: 1,
      borderRadius: hp(22),
    },
    reviewText: {
      ...commonFontStyle(600, 16, colors?.text_orange),
    },
    buyNowView: {
      height: hp(87),
      paddingHorizontal: wp(20),
      paddingVertical: hp(16),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.cards_bg,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 15,
    },
    pricesText: {
      ...commonFontStyle(500, 12, colors?.title_dec100),
    },
    prText: {
      marginTop: hp(8),
      ...commonFontStyle(700, 20, colors.text_orange),
    },
    buyNowBtn: {
      height: hp(55),
      backgroundColor: colors.text_orange,
      borderRadius: 15,
      paddingHorizontal: wp(30),
    },
    buyNowText: {
      ...commonFontStyle(600, 18, colors.defult_white),
    },
    basicInput1: {
      height: hp(88),
      borderRadius: 16,
      padding: 16,
      textAlignVertical: 'top',
      marginTop: hp(8),
      color: colors.black,
      borderColor: colors.border,
      borderWidth: 1,
      backgroundColor: colors.white,
    },
  });
};
