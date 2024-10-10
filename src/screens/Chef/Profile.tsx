import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import HomeHeader from '../../compoment/HomeHeader';
import { strings } from '../../i18n/i18n';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icons } from '../../utils/images';
import TitleList from '../../compoment/TitleListComponent';
import Spacer from '../../compoment/Spacer';
import ImagePicker from 'react-native-image-crop-picker';
import Loader from '../../compoment/Loader';
import { screenName } from '../../navigation/screenNames';
import { clearAsync, getAsyncUserInfo } from '../../utils/asyncStorageManager';
import { dispatchNavigation } from '../../utils/globalFunctions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import GeneralModal from '../../compoment/GeneralModal';
import { USER_LOGOUT } from '../../redux/actionTypes';
import { addDiscountAction } from '../../actions/commonAction';
import { errorToast } from '../../utils/commonFunction';
import ReviewModal from '../../compoment/ReviewModal';

type Props = {};

const Profile = (props: Props) => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const { isDarkTheme } = useAppSelector(state => state.common);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState < any > ({});
  const [photoUri, setPhotoUri] = useState(null);
  const [discountModal, setDiscountModal] = useState(false);
  const [lotSizeModal, setLotSizeModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [discountText, setDiscountText] = useState < string > ('');
  const dispatch = useAppDispatch();

  const fetchUserInfo = async () => {
    try {
      const userList = await getAsyncUserInfo();
      setUserData(userList);
      setName(userList.name || '');
      setNumber(userList.number || '');
      setPhotoUri(userList?.profile_image);
    } catch (error) { }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, []),
  );


  const onPressNavigation = list => {
    if (list == screenName.EditProfile) {
      navigation.navigate(list, { hideEdit: false, userData: userData });
    } else if (list === 'log Out') {
      setVisible(true);
    } else if (list === 'Discount') {
      setDiscountModal(true);
    } else if (list === 'OrderWaterBottle') {
      setLotSizeModal(true);
    } else if (list === 'Review') {
      setOpenReviewModal(true)
    } else {
      list !== '' && navigation.navigate(list);
    }
  };

  const closeModal = () => {
    setVisible(false);
    setDiscountModal(false);
    setLotSizeModal(false);
    setOpenReviewModal(false)
  };

  const onPressLogOut = async () => {
    setVisible(false);
    clearAsync();
    dispatch({ type: USER_LOGOUT });
    dispatchNavigation(screenName.SignInScreen);
    await GoogleSignin.signOut();
  };

  const onPressDiscount = () => {
    try {
      if (discountText.trim().length === 0) {
        errorToast(strings('supportText.e_discount'));
      } else {
        setLoading(true);
        let data = new FormData();
        data.append('discount', discountText);

        let userInfo = {
          data,
          onSuccess: res => {
            setDiscountModal(false);
            setDiscountText('');
            setLoading(false);
          },
          onFailure: (Err: any) => {
            if (Err !== undefined) {
              setLoading(false);
              errorToast(Err?.data?.message);
            }
            setLoading(false);
          },
        };
        dispatch(addDiscountAction(userInfo));
      }
    } catch {
      setLoading(false);
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
          console.log('dee');
        }}
        mainShow={true}
        title={strings('profileScreen.profile')}
        extraStyle={styles.headerContainer}
        isHideIcon={true}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={styles.contentContainerStyle}>
        <TouchableOpacity
          onPress={() => onPressNavigation('EditProfile')}
          activeOpacity={0.8}
          style={styles.profileContainer}>
          <View style={styles.profileView}>
            <View style={styles.profileBox}>
              {photoUri ? (
                <View style={styles.profilImage}>
                  <Image source={{ uri: photoUri }} style={styles.profilImage} />
                </View>
              ) : (
                <Image
                  source={Icons.profileImage}
                  style={[
                    styles.profilImage,
                    { backgroundColor: colors.bg_orange200 },
                  ]}
                />
              )}
              {/* <View style={styles.profilImage} /> */}
              <View style={styles.userNameView}>
                <Text style={styles.nameText}>{name}</Text>
                {/* <Text style={styles.numberText}>{number}</Text> */}
              </View>
            </View>
          </View>
          <TouchableOpacity>
            <Image style={styles.rightIcon} source={Icons.rightBack} />
          </TouchableOpacity>
        </TouchableOpacity>

        <Text style={styles.accountText}>
          {strings('profileScreen.accounts')}
        </Text>
        <TitleList
          arr_list={[
            {
              title: strings('profileScreen.personal_info'),
              iconName: Icons.profileIcon,
              screens: screenName.EditProfile,
            },
            {
              title: strings('profileScreen.Cuisines'),
              iconName: Icons.inventory,
              screens: screenName.CuisinesNameList,
            },
            {
              title: strings('profileScreen.menu'),
              iconName: Icons.inventory,
              screens: screenName.tab_bar_name.MenuList,
            },
            {
              title: strings('addFoodList.Miscellaneousitems'),
              iconName: Icons.inventory,
              screens: screenName.MiscellaneousList,
            },
            // {
            //   title: strings('profileScreen.inventory'),
            //   iconName: Icons.inventory,
            //   screens: '',
            // },
            {
              title: strings('profileScreen.ItemMasters'),
              iconName: Icons.inventory,
              screens: screenName.ItemMastersList,
            },
            {
              title: strings('profileScreen.recipes_master'),
              iconName: Icons.inventory,
              screens: screenName.RecipesMastersList,
            },
            {
              title: strings('profileScreen.chef'),
              iconName: Icons.chef,
              screens: screenName.ChefNameList,
            },
            {
              title: strings('profileScreen.order_history'),
              iconName: Icons.inventory,
              screens: screenName.OrderHistory,
            },
            // {
            //   title: strings('profileScreen.notifications'),
            //   iconName: Icons.notificationIcon,
            //   screens: screenName.ProfileNotification,
            // },
            // {
            //   title: strings('profileScreen.cuisines'),
            //   iconName: Icons.cuisine,
            //   screens: screenName.CuisinesNameList
            // },
          ]}
          onPressCell={onPressNavigation}
          styleProp={styles.boxCotainer}
        />
        <Text style={styles.accountText}>{strings('profileScreen.more')}</Text>
        <TitleList
          arr_list={[
            {
              title: strings('profileScreen.review'),
              iconName: Icons.stareIcon,
              screens: 'Review',
            },
            {
              title: strings('profileScreen.discount'),
              iconName: Icons.discountIcon,
              screens: 'Discount',
            },
            {
              title: strings('profileScreen.OrderWaterBottle'),
              iconName: Icons.supportIcon,
              screens: 'OrderWaterBottle',
            },
            {
              title: strings('profileScreen.support'),
              iconName: Icons.supportIcon,
              screens: screenName.Support,
            },
            {
              title: strings('profileScreen.privacy_policy'),
              iconName: Icons.privacyIcon,
              screens: screenName.PrivacyPolicy,
            },
            {
              title: strings('profileScreen.term_condition'),
              iconName: Icons.termIcon,
              screens: screenName.TermCondition,
            },
            {
              title: strings('profileScreen.settings'),
              iconName: Icons.settingsIcon,
              screens: screenName.Settings,
            },
            {
              title: strings('profileScreen.log_out'),
              iconName: Icons.logout,
              screens: 'log Out',
            },
          ]}
          onPressCell={onPressNavigation}
          styleProp={styles.boxCotainer}
        />
        {/* <TitleList
          arr_list={[
            {
              title: strings('profileScreen.log_out'),
              iconName: Icons.logout,
            },
          ]}
          onPressCell={async () => {
            clearAsync(), dispatchNavigation(screenName.RoleSelectionScreen);
            await GoogleSignin.signOut();
          }}
          styleProp={styles.boxCotainer}
        /> */}
        <Spacer height={hp(90)} />
      </KeyboardAwareScrollView>

      <GeneralModal
        title={strings('Settings.logoutDes')}
        rightText={strings('CuisinesNameList.submit')}
        leftText={strings('Settings.cancel')}
        visible={visible}
        closeModal={() => closeModal()}
        onPressDelete={() => onPressLogOut()}
        isShowLogOut={true}
      />
      <GeneralModal
        title={strings('Settings.logoutDes')}
        rightText={strings('CuisinesNameList.submit')}
        leftText={strings('Settings.cancel')}
        visible={discountModal}
        closeModal={() => closeModal()}
        onPressDelete={() => onPressDiscount()}
        isShowDiscount={true}
        discountText={discountText}
        setDiscountText={setDiscountText}
        loading={loading}
      />
      <GeneralModal
        title={strings('Settings.logoutDes')}
        rightText={strings('CuisinesNameList.submit')}
        leftText={strings('Settings.cancel')}
        visible={lotSizeModal}
        closeModal={() => closeModal()}
        // onPressDelete={() => onOrderBottle()}
        isShowLotSize={true}
        setLoading={setLoading}
        setLotSizeModal={setLotSizeModal}
      />
      <ReviewModal
        title={strings('profileScreen.review')}
        visible={openReviewModal}
        closeModal={() => closeModal()} />
    </View>
  );
};

export default Profile;

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
    contentContainerStyle: {
      marginHorizontal: wp(20),
    },
    profileView: {
      flex: 1,
    },
    profileBox: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cards_bg,
      paddingVertical: hp(12),
      paddingHorizontal: wp(16),
      borderRadius: 16,
    },
    profilImage: {
      width: wp(64),
      height: wp(64),
      borderRadius: wp(64),
      borderColor: colors.text_orange,
      borderWidth: 1,
      // backgroundColor: colors.bg_orange200,
    },
    userNameView: {
      marginLeft: wp(12),
    },
    nameText: {
      ...commonFontStyle(700, 16, colors.black),
    },
    numberText: {
      marginTop: hp(4),
      ...commonFontStyle(400, 12, colors.title_dec100),
    },
    boxCotainer: {
      marginTop: hp(8),
    },
    rightIcon: {
      width: wp(14),
      height: hp(14),
      resizeMode: 'contain',
    },
    accountText: {
      marginTop: hp(20),
      ...commonFontStyle(500, 16, colors.black),
    },
  });
};
