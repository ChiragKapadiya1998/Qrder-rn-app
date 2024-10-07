import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import HomeHeader from '../../compoment/HomeHeader';
import { strings } from '../../i18n/i18n';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Icons } from '../../utils/images';
import Input from '../../compoment/Input';
import { emailCheck, errorToast } from '../../utils/commonFunction';
import ImageCropPicker from 'react-native-image-crop-picker';
import PrimaryButton from '../../compoment/PrimaryButton';
import { updateLocale } from 'moment';
import { updateProfile } from '../../actions/authAction';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spacer from '../../compoment/Spacer';
import { openImagePicker } from '../../utils/globalFunctions';

type Props = {};

const EditProfile = (props: Props) => {
  const route = useRoute();
  const { userData } = route?.params;
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const { isDarkTheme } = useAppSelector(state => state.common);
  const [names, setName] = useState < string > (userData?.name);
  const [lastName, setLastName] = useState(
    userData?.last_name ? userData?.last_name : '',
  );
  const [restaurant, setRestaurant] = useState < string > (
    userData.restaurant_name,
  );
  const [emails, setEmail] = useState < string > (userData.email);
  const [numbers, setNumber] = useState < string > (userData.number);
  const [address, setAddress] = useState < string > (userData.address);
  const [photoUri, setPhotoUri] = useState(userData.profile_image);
  const [loading, setLoading] = useState(false);
  const { getCuisines } = useAppSelector(state => state.data);
  const [quantityValue, setQuantityValue] = useState(
    getCuisines?.filter(item => item?.id == userData.cuisine_id)?.[0]?.name,
  );

  const [imageData, setImageData] = useState < any > ({
    uri: userData.profile_image ? userData.profile_image : '',
  });
  const [isPictureEdit, setIsPictureEdit] = useState < boolean > (
    userData.profile_image ? true : false,
  );

  const [salary, setSalary] = useState(userData?.salary ? userData.salary.toString() : '');


  console.log(
    'userDatadasda',
    getCuisines?.filter(item => item?.id == userData.cuisine_id)?.[0]?.name,
  );

  const selectImage = () => {
    openImagePicker({
      onSucess: res => {
        setImageData(res);
        setIsPictureEdit(true);
      },
    });
  };

  const onPressStudentEditDone = () => {
    if (names.trim().length === 0) {
      errorToast(strings('login.error_name'));
    } else if (lastName.trim().length === 0) {
      errorToast(strings('login.error_nameLastName'));
    } else if (emails.trim().length === 0) {
      errorToast(strings('login.error_email'));
    } else if (!emailCheck(emails)) {
      errorToast(strings('login.error_v_email'));
    } else if (numbers.trim().length === 0) {
      errorToast(strings('login.error_phone'));
    } else if (numbers.trim().length !== 10) {
      errorToast(strings('login.error_v_phone'));
    } else {
      var data = new FormData();
      data.append('name', names);
      data.append('last_name', lastName);
      data.append('email', emails);
      data.append('number', numbers);
      if (imageData?.uri !== userData.profile_image) {
        data.append('file', {
          uri: imageData?.uri,
          type: imageData?.mime,
          name: imageData?.name,
        });
      }
      let obj = {
        data,
        onSuccess: (response: any) => {
          navigation.goBack();
        },
        onFailure: (Err: any) => {
          if (Err != undefined) {
            Alert.alert(Err?.message);
          }
        },
      };
      dispatch(updateProfile(obj));
    }
  };

  const onPressAdminEditDone = () => {
    if (names.trim().length === 0) {
      errorToast(strings('login.error_name'));
    } else if (lastName.trim().length === 0) {
      errorToast(strings('login.error_nameLastName'));
    } else if (restaurant.trim().length === 0) {
      errorToast(strings('login.error_restaurantName'));
    } else if (emails.trim().length === 0) {
      errorToast(strings('login.error_email'));
    } else if (!emailCheck(emails)) {
      errorToast(strings('login.error_v_email'));
    } else if (numbers.trim().length === 0) {
      errorToast(strings('login.error_phone'));
    } else if (numbers.trim().length !== 10) {
      errorToast(strings('login.error_v_phone'));
    } else if (address.trim().length == 0) {
      errorToast(strings('login.error_address'));
    } else {
      var data = new FormData();
      data.append('name', names);
      data.append('last_name', lastName);
      data.append('email', emails);
      data.append('number', numbers);
      //   data.append('restaurant_name', restaurant);
      data.append('address', address);
      if (imageData?.uri !== userData.profile_image) {
        data.append('profile_image', {
          uri: imageData?.uri,
          type: imageData?.mime,
          name: imageData?.name,
        });
      }
      let obj = {
        data,
        onSuccess: (response: any) => {
          navigation.goBack();
          setEmail('');
          setName('');
          setNumber('');
        },
        onFailure: (Err: any) => {
          if (Err != undefined) {
            Alert.alert(Err?.message);
          }
        },
      };
      dispatch(updateProfile(obj));
    }
  };

  console.log('userData', userData.role);

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
        mainShow={true}
        title={strings('profileScreen.profile')}
        isShowIcon={false}
        extraStyle={styles.headerContainer}
        isHideIcon={true}
        rightTextStyle={styles.rightTextStyle}
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.subContainer}>
          <View style={styles.profileContainer}>
            <View>
              {imageData?.uri ? (
                <View style={styles.profilImage}>
                  <Image
                    source={{ uri: imageData?.uri }}
                    style={styles.profilImage}
                  />
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

              {userData.role !== 'staff' ? (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={selectImage}
                  style={styles.editImage}>
                  <Image
                    source={Icons.editPencial}
                    style={styles.profileIcon}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          <View style={styles.inputView}>
            <Input
              value={names}
              placeholder={strings('sign_up.p_name')}
              label={strings('sign_up.first_name')}
              onChangeText={(t: string) => setName(t)}
              isShowLabel={true}
              inputStyle={styles.inputStyle}
              editable={userData.role == 'staff' ? false : true}
            />
            {userData.role !== 'staff' ? (
              <Input
                value={lastName}
                placeholder={strings('sign_up.lats_p_name')}
                label={strings('sign_up.last_name')}
                onChangeText={(t: string) => setLastName(t)}
                isShowLabel={true}
                inputStyle={styles.inputStyle}
              />
            ) : null}
            {userData.role === 'student' || userData.role === 'staff' ? null : (
              <Input
                value={restaurant}
                placeholder={
                  userData?.role == 'canteen'
                    ? strings('sign_up.p_enter_canteen')
                    : strings('sign_up.restaurant_name')
                }
                label={
                  userData?.role == 'canteen'
                    ? strings('sign_up.canteen_name')
                    : strings('sign_up.restaurant')
                }
                onChangeText={(t: string) => setRestaurant(t)}
                isShowLabel={true}
                inputStyle={styles.inputStyle}
              />
            )}

            <Input
              value={emails}
              placeholder={strings('sign_up.p_email')}
              label={strings('sign_up.email_address')}
              onChangeText={(t: string) => setEmail(t)}
              isShowLabel={true}
              inputStyle={styles.inputStyle}
              editable={userData.role == 'staff' ? false : true}
            />
            {userData.role == 'staff' ? (
              <Input
                value={quantityValue}
                placeholder={strings('chefSignUp.Cuisine')}
                label={strings('chefSignUp.Cuisine')}
                onChangeText={(t: string) => setLastName(t)}
                isShowLabel={true}
                inputStyle={styles.inputStyle}
                editable={false}
              />
            ) : null}
            <Input
              value={numbers}
              placeholder={strings('sign_up.p_enter_phone')}
              keyboardType="number-pad"
              label={strings('chefSignUp.phone_Number')}
              onChangeText={(t: string) => setNumber(t)}
              maxLength={10}
              isShowLabel={true}
              inputStyle={styles.inputStyle}
              editable={userData.role == 'staff' ? false : true}
            />

            {userData.role == 'staff' ? (
              <Input
                value={salary}
                placeholder={strings('chefSignUp.p_salary')}
                label={strings('chefSignUp.salary')}
                onChangeText={(t: string) => setLastName(t)}
                isShowLabel={true}
                inputStyle={styles.inputStyle}
                editable={false}
              />
            ) : null}
            {userData.role === 'student' || userData.role === 'staff' ? null : (
              <Input
                value={address}
                placeholder={strings('sign_up.p_enter_area')}
                label={strings('sign_up.address')}
                onChangeText={(t: string) => setAddress(t)}
                isShowLabel={true}
                inputStyle={styles.inputStyle}
                editable={false}
              />
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>

      {userData.role !== 'staff' ? (
        <View style={{ bottom: 8, paddingHorizontal: wp(20) }}>
          <PrimaryButton
            extraStyle={styles.signupButton}
            // onPress={onPressEditDone}
            onPress={() => {
              userData.role == 'student'
                ? onPressStudentEditDone()
                : onPressAdminEditDone();
            }}
            title={strings('PersonalInfo.save_details')}
          />
        </View>
      ) : null}
    </View>
  );
};

export default EditProfile;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    headerContainer: {
      backgroundColor: colors.white,
    },
    rightTextStyle: {
      textDecorationLine: 'underline',
      textTransform: 'uppercase',
    },
    subContainer: {
      paddingHorizontal: wp(20),
      marginTop: hp(3),
    },
    profileContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    profilImage: {
      width: wp(99),
      height: wp(99),
      borderRadius: wp(99),
      borderColor: colors.text_orange,
      borderWidth: 1,
    },
    editImage: {
      width: wp(30),
      height: wp(30),
      borderRadius: wp(15),
      backgroundColor: colors.Primary_Orange,
      borderColor: colors.white,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 2,
      right: 0,
    },
    profileIcon: {
      width: 16,
      height: 16,
      resizeMode: 'contain',
    },
    inputView: {},
    inputStyle: {
      borderColor: colors.text_orange,
    },
    loader: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    uploadText: {
      paddingTop: hp(12),
      ...commonFontStyle(700, 20, colors.Title_Text),
    },
    signupButton: {
      marginTop: hp(20),
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentContainerStyle: {
      paddingHorizontal: wp(20),
    },
  });
};
