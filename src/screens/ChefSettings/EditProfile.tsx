import {
  Alert,
  Image,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  useIsFocused,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import HomeHeader from '../../compoment/HomeHeader';
import {strings} from '../../i18n/i18n';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {Icons} from '../../utils/images';
import Input from '../../compoment/Input';
import {emailCheck, errorToast} from '../../utils/commonFunction';
import ImageCropPicker from 'react-native-image-crop-picker';
import PrimaryButton from '../../compoment/PrimaryButton';
import {updateLocale} from 'moment';
import {updateProfile} from '../../actions/authAction';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Spacer from '../../compoment/Spacer';
import {openImagePicker} from '../../utils/globalFunctions';
import debounce from 'lodash/debounce';
import {
  getCityAction,
  getstateAction,
  searchCities,
} from '../../actions/commonAction';

type Props = {};

const EditProfile = (props: Props) => {
  const route = useRoute();
  const {userData} = route?.params;
  const {colors, isDark} = useTheme();
  const navigation = useNavigation();
  const isFocuse = useIsFocused();
  const dispatch = useAppDispatch();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const {isDarkTheme, searchCity, getCity} = useAppSelector(
    state => state.common,
  );
  const [names, setName] = useState<string>(userData?.name);
  const [lastName, setLastName] = useState(
    userData?.last_name ? userData?.last_name : '',
  );
  const [restaurant, setRestaurant] = useState<string>(
    userData.restaurant_name,
  );
  const [gstNumber, setGstNumber] = useState<string>(
    userData.gst_number !== null ? userData.gst_number : '',
  );
  const [fssaiNumber, setFssaiNumber] = useState<string>(
    userData.fssai_number !== null ? userData.fssai_number : '',
  );
  const [googleReview, setGoogleReview] = useState<string>(
    userData.google_review_link !== null ? userData.google_review_link : '',
  );
  const [pincode, setPincode] = useState(String(userData?.pincode));
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [showListView, setShowListView] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [emails, setEmail] = useState<string>(
    userData.email ? userData.email : '',
  );
  const [numbers, setNumber] = useState<string>(
    userData.number ? userData.number : '',
  );
  const [address, setAddress] = useState<string>(userData.address);
  const [photoUri, setPhotoUri] = useState(userData.profile_image);
  const [loading, setLoading] = useState(false);
  const {getCuisines} = useAppSelector(state => state.data);
  const [quantityValue, setQuantityValue] = useState(
    getCuisines?.filter(item => item?.id == userData.cuisine_id)?.[0]?.name,
  );

  const [imageData, setImageData] = useState<any>({
    uri: userData.profile_image ? userData.profile_image : '',
  });
  const [isPictureEdit, setIsPictureEdit] = useState<boolean>(
    userData.profile_image ? true : false,
  );
  console.log('userData.number', userData.number);

  const [salary, setSalary] = useState(
    userData?.salary ? userData.salary.toString() : '',
  );

  useEffect(() => {
    getCityList();
  }, [isFocuse]);

  const getCityList = () => {
    let obj = {
      data: {
        id: userData.city_id,
      },
      onSuccess: (res: any) => {
        setCity(res?.city_name);
        setState(res?.state_name);
        setCountry(res?.country_name);
        setAddressList(res.city);
      },
      onFailure: (Err: any) => {},
    };
    dispatch(getCityAction(obj));
  };

  const debouncedFilterSearch = React.useCallback(
    debounce(searchText => {
      let UserInfo = {
        data: searchText,
        onSuccess: res => {},
        onFailure: Err => {},
      };
      dispatch(searchCities(UserInfo));
    }, 300),
    [],
  );

  const FilterSearch = (searchText: any) => {
    setCity(searchText);
    if (searchText.length >= 3) {
      debouncedFilterSearch(searchText);
    }
  };

  const selectImage = () => {
    openImagePicker({
      onSucess: res => {
        setImageData(res);
        setIsPictureEdit(true);
      },
    });
  };

  const onPressStudentEditDone = () => {
    if (imageData?.uri === '') {
      errorToast(strings('addFoodList.selectImg'));
    } else if (names.trim().length === 0) {
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
      setLoading(true);
      var data = new FormData();
      data.append('name', names);
      data.append('last_name', lastName);
      data.append('email', emails);
      data.append('number', numbers);
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
          setLoading(false);
        },
        onFailure: (Err: any) => {
          if (Err != undefined) {
            Alert.alert(Err?.message);
          }
          setLoading(false);
        },
      };
      dispatch(updateProfile(obj));
    }
  };

  const onPressAdminEditDone = () => {
    if (imageData?.uri === '') {
      errorToast(strings('addFoodList.selectImg'));
    } else if (names.trim().length === 0) {
      errorToast(strings('login.error_name'));
    } else if (lastName.trim().length === 0) {
      errorToast(strings('login.error_nameLastName'));
    } else if (restaurant.trim().length === 0) {
      errorToast(strings('login.error_restaurantName'));
    } else if (gstNumber.trim().length === 0) {
      errorToast(strings('newAddText.e_gst_number'));
    } else if (fssaiNumber.trim().length === 0) {
      errorToast(strings('newAddText.e_FSSAI_number'));
    } else if (googleReview.trim().length === 0) {
      errorToast(strings('newAddText.e_google_review_link'));
    } else if (emails.trim().length === 0) {
      errorToast(strings('login.error_email'));
    } else if (!emailCheck(emails)) {
      errorToast(strings('login.error_v_email'));
    } else if (numbers?.trim()?.length === 0) {
      errorToast(strings('login.error_phone'));
    } else if (numbers?.trim()?.length !== 10) {
      errorToast(strings('login.error_v_phone'));
    } else if (address.trim().length == 0) {
      errorToast(strings('login.error_address'));
    } else if (city?.trim().length === 0) {
      errorToast(strings('login.error_city'));
    } else if (state?.trim().length === 0) {
      errorToast(strings('login.error_state'));
    } else if (country?.trim().length === 0) {
      errorToast(strings('login.error_country'));
    } else if (pincode.trim().length === 0) {
      errorToast(strings('login.error_pincode'));
    } else {
      setLoading(true);
      var data = new FormData();
      data.append('name', names);
      data.append('last_name', lastName);
      data.append('email', emails);
      data.append('number', numbers);
      data.append('restaurant_name', restaurant);
      data.append('gst_number', gstNumber);
      data.append('fssai_number', fssaiNumber);
      data.append('google_review_link', googleReview);
      data.append('pincode', pincode);
      data.append('city_id', addressList?.id);
      data.append('state_id', addressList?.state?.id);
      data.append('country_id', addressList?.state?.country?.id);
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
          setLoading(false);
        },
        onFailure: (Err: any) => {
          setLoading(false);
          if (Err != undefined) {
            Alert.alert(Err?.message);
          }
        },
      };
      dispatch(updateProfile(obj));
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
        mainShow={true}
        title={
          userData.role === 'staff'
            ? strings('profileScreen.view_chef')
            : strings('profileScreen.profile')
        }
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
                    source={{uri: imageData?.uri}}
                    style={styles.profilImage}
                  />
                </View>
              ) : (
                <Image
                  source={Icons.profileImage}
                  style={[
                    styles.profilImage,
                    {backgroundColor: colors.bg_orange200},
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
              placeholder={strings('editProfiles.add_first_name')}
              label={strings('sign_up.first_name')}
              onChangeText={(t: string) => setName(t)}
              isShowLabel={true}
              inputStyle={styles.inputStyle}
              editable={userData.role == 'staff' ? false : true}
            />
            {userData.role !== 'staff' ? (
              <Input
                value={lastName}
                placeholder={strings('editProfiles.add_last_name')}
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
                    ? strings('editProfiles.add_canteen_name')
                    : strings('editProfiles.add_restaurant_name')
                }
                label={
                  userData?.role == 'canteen'
                    ? strings('newAddText.canteen_name')
                    : strings('newAddText.restaurant_name')
                }
                onChangeText={(t: string) => setRestaurant(t)}
                isShowLabel={true}
                inputStyle={styles.inputStyle}
              />
            )}

            {userData.role === 'student' || userData.role === 'staff' ? null : (
              <>
                <Input
                  value={gstNumber}
                  placeholder={strings('newAddText.gst_number')}
                  label={strings('newAddText.gst_number')}
                  onChangeText={(t: string) => setGstNumber(t)}
                  isShowLabel={true}
                  inputStyle={styles.inputStyle}
                  editable={userData.role == 'staff' ? false : true}
                />

                <Input
                  value={fssaiNumber}
                  placeholder={strings('newAddText.FSSAI_number')}
                  label={strings('newAddText.FSSAI_number')}
                  onChangeText={(t: string) => setFssaiNumber(t)}
                  isShowLabel={true}
                  inputStyle={styles.inputStyle}
                  editable={userData.role == 'staff' ? false : true}
                />
                <Input
                  value={googleReview}
                  placeholder={strings('newAddText.google_review_link')}
                  label={strings('newAddText.google_review_link')}
                  onChangeText={(t: string) => setGoogleReview(t)}
                  isShowLabel={true}
                  inputStyle={styles.inputStyle}
                  editable={userData.role == 'staff' ? false : true}
                />
              </>
            )}
            <Input
              value={emails}
              placeholder={strings('editProfiles.add_email')}
              label={strings('sign_up.email')}
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
              placeholder={
                userData.role === 'student'
                  ? strings('sign_up.p_enter_phone')
                  : strings('editProfiles.add_contact_number')
              }
              keyboardType="number-pad"
              label={
                userData.role === 'student'
                  ? strings('chefSignUp.phone_Number')
                  : strings('newAddText.contact_number')
              }
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
              <>
                <Input
                  value={address}
                  placeholder={strings('editProfiles.add_address')}
                  label={strings('sign_up.address')}
                  onChangeText={(t: string) => setAddress(t)}
                  isShowLabel={true}
                  inputStyle={styles.inputStyle}
                />
                <Input
                  value={city}
                  placeholder={strings('newAddText.select_city')}
                  label={strings('newAddText.select_city')}
                  onChangeText={(t: string) => FilterSearch(t)}
                  showListView={showListView}
                  searchData={searchCity}
                  setShowListView={item => {
                    setShowListView(false);
                    setCity(item.name);
                    setState(item?.state?.name);
                    setCountry(item?.state?.country?.name);
                    setAddressList(item);
                  }}
                  onFocus={() => {
                    setShowListView(true);
                  }}
                  isShowLabel={true}
                />
                <Input
                  value={state}
                  placeholder={strings('newAddText.select_state')}
                  label={strings('newAddText.select_state')}
                  onChangeText={(t: string) => setState(t)}
                  showListView={false}
                  isShowLabel={true}
                />
                <Input
                  value={country}
                  placeholder={strings('newAddText.select_country')}
                  label={strings('newAddText.select_country')}
                  onChangeText={(t: string) => setCountry(t)}
                  isShowLabel={true}
                />

                <Input
                  value={pincode}
                  placeholder={strings('editProfiles.add_pincode')}
                  keyboardType="number-pad"
                  label={strings('newAddText.pincode')}
                  onChangeText={(t: string) => setPincode(t)}
                  isShowLabel={true}
                  inputStyle={styles.inputStyle}
                />
                {userData.role === 'student' ||
                userData.role === 'staff' ? null : (
                  <TouchableOpacity
                    onPress={() => Linking.openURL('https://qrder.in/profile')}>
                    <Text style={styles.qrCodetext}>
                      {strings('newAddText.download_qr_code')}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>

      {userData.role !== 'staff' ? (
        <View style={{bottom: 8, paddingHorizontal: wp(20)}}>
          <PrimaryButton
            extraStyle={styles.signupButton}
            // onPress={onPressEditDone}
            onPress={() => {
              userData.role == 'student'
                ? onPressStudentEditDone()
                : onPressAdminEditDone();
            }}
            title={strings('PersonalInfo.save_details')}
            isLoading={loading}
          />
        </View>
      ) : null}
    </View>
  );
};

export default EditProfile;

const getGlobalStyles = (props: any) => {
  const {colors} = props;
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
      // marginTop: hp(20),
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentContainerStyle: {
      paddingHorizontal: wp(20),
    },
    qrCodetext: {
      marginTop: hp(16),
      marginBottom: hp(23),
      ...commonFontStyle(600, 14, colors.black),
      textDecorationLine: 'underline',
    },
  });
};
