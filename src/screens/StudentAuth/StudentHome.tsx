import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation, useTheme} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import HomeHeader from '../../compoment/HomeHeader';
import {strings} from '../../i18n/i18n';
import {commonFontStyle, hp, SCREEN_WIDTH, wp} from '../../theme/fonts';
import Spacer from '../../compoment/Spacer';
import NoDataFound from '../../compoment/NoDataFound';
import {screenName} from '../../navigation/screenNames';
import {getCardAction} from '../../actions/cardAction';
import CardView from '../../compoment/CardView';
import {
  getRestaurantDiscountAction,
  getUniversityDataAction,
} from '../../actions/commonAction';
import {getAsyncUserInfo} from '../../utils/asyncStorageManager';
import {Icons} from '../../utils/images';
import {getUserAction} from '../../actions/authAction';
import {GET_CANTEEN_CUISINE_LIST} from '../../redux/actionTypes';

const StudentHome = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const isFocuse = useIsFocused();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const {isDarkTheme} = useAppSelector(state => state.common);
  const {getUniversityCanteenData} = useAppSelector(state => state.data);
  const dispatch = useAppDispatch();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handlePress = (item: any, isCheckbox: boolean) => {
    item?.id && getDiscount(item?.id);
    if (isCheckbox) {
      onSelectCheckbox(item);
      setTimeout(() => {
        onPressCanteen(item);
      }, 500);
    } else {
      onPressCanteen(item);
    }
  };

  const onPressCanteen = (item: any) => {
    navigation.navigate(screenName.StudentMenuList, {
      selectID: item?.id,
      canteenName: item?.restaurant_name,
    });
  };

  const onSelectCheckbox = (item: any) => {
    if (selectedItems.includes(item.id)) {
      setSelectedItems(prev => prev.filter(id => id !== item.id));
    } else {
      setSelectedItems(prev => [...prev, item.id]);
    }
  };

  const getDiscount = id => {
    var data = new FormData();
    data.append('canteen_id', id?.toString());
    let obj = {
      data,
      onSuccess: (res: any) => {},
      onFailure: (Err: any) => {},
    };
    dispatch(getRestaurantDiscountAction(obj));
  };

  useEffect(() => {
    getCardDatas();
    onGetDataProfile();
    onGetData();
    if (isFocuse) {
      setSelectedItems([]);
    }
  }, [isFocuse]);

  const onGetDataProfile = async () => {
    let obj = {
      onSuccess: (res: any) => {
        let obj = {
          params: res.university_id,
          onSuccess: (res: any) => {},
          onFailure: (Err: any) => {},
        };
        dispatch(getUniversityDataAction(obj));
      },
      onFailure: (Err: any) => {},
    };
    dispatch(getUserAction(obj));
  };

  const onGetData = async () => {
    const userDetails = await getAsyncUserInfo();
    setLoading(true);
    let obj = {
      params: userDetails.university_id,
      onSuccess: (res: any) => {
        setLoading(false);
      },
      onFailure: (Err: any) => {
        setLoading(false);
      },
    };
    dispatch(getUniversityDataAction(obj));
  };

  const getCardDatas = () => {
    let obj = {
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getCardAction(obj));
  };

  const renderItem = ({item, index}) => {
    const isLastItem = index === getUniversityCanteenData?.length - 1;
    const isSelected = selectedItems?.includes(item.id);
    return (
      <View style={[styles.boxView]}>
        <TouchableOpacity
          onPress={() => handlePress(item, false)}
          style={styles.subBoxView}>
          <View style={styles.containers}>
            <View style={[styles.leftView, !isLastItem && styles.withBorder]}>
              <View style={[styles.viewStyle, {flex: 1}]}>
                <Text numberOfLines={1} style={styles.titleText}>
                  {item.restaurant_name}
                </Text>
              </View>
              <View style={styles.viewStyle}>
                <TouchableOpacity
                  onPress={() => handlePress(item, true)}
                  style={[
                    styles.checkbox,
                    isSelected && styles.selectedCheckbox,
                  ]}>
                  {isSelected && (
                    <Image style={styles.ic_check} source={Icons.ic_check} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
          navigation.goBack();
        }}
        extraStyle={styles.headerContainer}
        isHideIcon={true}
        isShowIcon={false}
        showRight={false}
        onRightPressNotification={() => {
          navigation.navigate(screenName.ChefNotification);
        }}
      />
      {getUniversityCanteenData?.length || !loading ? (
        <View style={{marginHorizontal: wp(20)}}>
          <CardView
            containerStyle={styles.headerView}
            onPress={() => {}}
            isDisabled={true}>
            <Text style={styles.headerSubText}>
              {strings('StudentSignUp.ListofCanteen')}
            </Text>
          </CardView>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={getUniversityCanteenData}
            renderItem={renderItem}
            ListEmptyComponent={!loading && <NoDataFound />}
            ListFooterComponent={() => {
              return (
                <View>
                  <Spacer height={150} />
                </View>
              );
            }}
          />
        </View>
      ) : (
        <View style={styles.centerLoadr}>
          <ActivityIndicator color={colors.black} />
        </View>
      )}
    </View>
  );
};

export default StudentHome;

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
    headerView: {
      // flex: 1,
      justifyContent: 'flex-start',
      backgroundColor: colors.cards_bg,
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: wp(16),
      paddingVertical: hp(12),
      marginHorizontal: 0,
      borderRadius: 8,
    },
    headerSubText: {
      ...commonFontStyle(500, 18, colors.black),
      marginLeft: 10,
    },
    boxView: {},
    subBoxView: {
      flexDirection: 'row',
    },
    containers: {
      flex: 1,
    },
    leftView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: hp(16),
    },
    withBorder: {
      borderBottomWidth: 1,
      borderColor: colors.image_bg,
    },
    imageStyle: {
      width: 16,
      height: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.text_gray,
      resizeMode: 'cover',
      marginRight: wp(8),
    },
    editIcon: {
      width: 16,
      height: 16,
      resizeMode: 'contain',
    },
    viewStyle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleText: {
      flex: 1,
      ...commonFontStyle(500, 14, colors.black),
    },
    checkbox: {
      height: hp(22),
      width: wp(22),
      borderRadius: 11,
      borderWidth: 1,
      borderColor: colors.text_border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedCheckbox: {
      backgroundColor: colors.blue,
    },
    ic_check: {
      width: 12,
      height: 12,
    },
    centerLoadr: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
