import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useTheme } from '@react-navigation/native';
import { commonFontStyle, hp, isIos, wp } from '../../theme/fonts';
import Input from '../../compoment/Input';
import PrimaryButton from '../../compoment/PrimaryButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoginHeader from '../../compoment/LoginHeader';
import { screenName } from '../../navigation/screenNames';
import { strings } from '../../i18n/i18n';
import Spacer from '../../compoment/Spacer';
import {
  DropDownData,
  DropDownDatas,
  emailCheck,
  errorToast,
  numberCheck,
  specialCarCheck,
  UpperCaseCheck,
} from '../../utils/commonFunction';
import { dispatchNavigation } from '../../utils/globalFunctions';
import {
  canteenRegisterSignUp,
  googleEmailAction,
  studentUserSignUp,
  userSignUp,
} from '../../actions/authAction';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  getCityAction,
  getUniversitiesDataAction,
  searchCities,
} from '../../actions/commonAction';
import debounce from 'lodash/debounce';
import CCDropDown from '../../compoment/CCDropDown';
import { setAsyncRole } from '../../utils/asyncStorageManager';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Icons } from '../../utils/images';
import { GOOGLE_WEB_CLINET_ID } from '../../utils/apiConstants';
type Props = {};

const SignUpScreen = (props: Props) => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const [name, setName] = useState('');
  const [user_name, setUser_name] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState < boolean > (true);
  const [isShowRePassword, setisShowRePassword] = useState < boolean > (true);
  const [number, setNumber] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [canteenName, setCanteenName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [pincode, setPincode] = useState('');
  const [showListView, setShowListView] = useState(false);
  const { getCity, searchCity } = useAppSelector(state => state.common);
  const { getUniversitiesData } = useAppSelector(state => state.data);
  const [filteredData, setFilteredData] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [area, setArea] = useState('');
  const [selectedOption, setSelectedOption] = useState(strings('sign_up.restaurant'));
  const [selectRole, setSelectRole] = useState('');
  const [selectUniversity, setSelectUniversity] = useState('');

  const [collegeName, setCollegeName] = useState('');
  const [hostelName, setHostelName] = useState('');
  const [hostelAddress, setHostelAddress] = useState('');

  const options = [
    { name: strings('sign_up.restaurant'), value: 'Restaurant' },
    { name: strings('sign_up.canteen'), value: 'Canteen' },
    { name: strings('sign_up.student'), value: 'Student' },
  ];

  const handlePress = value => {
    setSelectedOption(value);
    // emptyFiled();
  };

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // getCityList()
    getUniversitiesDataPress();
  }, []);


  const getUniversitiesDataPress = () => {
    let obj = {
      onSuccess: (res: any) => { },
      onFailure: (Err: any) => { },
    };
    dispatch(getUniversitiesDataAction(obj));
  };

  const emptyFiled = () => {
    setName('');
    setUser_name('');
    setLastName('');
    setEmail('');
    setPassword('');
    setRePassword('');
    setNumber('');
    setRestaurantName('');
    setUniversityName('');
    setCanteenName('');
    setCity('');
    setState('');
    setCountry('');
    setPincode('');
    setShowListView(false);
    setFilteredData([]);
    setAddressList([]);
    setArea('');
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  const onPressLogin = () => {
    if (selectRole.trim().length === 0) {
      errorToast(strings('login.error_role'));
    } else if (name.trim().length === 0) {
      errorToast(strings('login.error_name'));
    } else if (user_name.trim().length === 0) {
      errorToast(strings('sign_up.user_name_error'));
    } else if (lastName.trim().length === 0) {
      errorToast(strings('login.error_nameLastName'));
    } else if (email.trim().length === 0) {
      errorToast(strings('login.error_email'));
    } else if (!emailCheck(email)) {
      errorToast(strings('login.error_v_email'));
    } else if (number.trim().length === 0) {
      errorToast(strings('login.error_phone'));
    } else if (number.trim().length !== 10) {
      errorToast(strings('login.error_v_phone'));
    } else if (restaurantName.trim().length == 0) {
      errorToast(strings('login.error_restaurantName'));
    } else if (area.trim().length === 0) {
      errorToast(strings('login.error_address'));
    } else if (city.trim().length === 0) {
      errorToast(strings('login.error_city'));
    } else if (state.trim().length === 0) {
      errorToast(strings('login.error_state'));
    } else if (country.trim().length === 0) {
      errorToast(strings('login.error_country'));
    } else if (pincode.trim().length === 0) {
      errorToast(strings('login.error_pincode'));
    } else if (password.trim().length === 0) {
      errorToast(strings('login.error_password'));
    } else if (password.trim().length < 9) {
      errorToast(strings('login.error_v_password'));
    } else if (!numberCheck(password)) {
      errorToast(strings('login.error_number_password'));
    } else if (!specialCarCheck(password)) {
      errorToast(strings('login.error_character_password'));
    } else if (!UpperCaseCheck(password)) {
      errorToast(strings('login.error_uppercase_password'));
    } else if (rePassword.trim().length === 0) {
      errorToast(strings('login.error_re_tyre'));
    } else if (rePassword.trim() !== password.trim()) {
      errorToast(strings('login.error_re_tyre_match'));
    } else {
      var data = new FormData();
      data.append('name', name);
      data.append('user_name', user_name);
      data.append('last_name', lastName);
      data.append('email', email);
      data.append('password', password);
      data.append('confirmed', rePassword);
      data.append('restaurant_name', restaurantName);
      data.append('number', number);
      data.append('address', area);
      data.append('pincode', pincode);
      data.append('city_id', addressList?.id);
      data.append('state_id', addressList?.state?.id);
      data.append('country_id', addressList?.state?.country?.id);
      data.append('role', 'admin');
      data.append('status', '1');
      let obj = {
        data,
        onSuccess: async (response: any) => {
          await setAsyncRole(selectRole);
          dispatchNavigation(screenName.BottomTabBar);
        },
        onFailure: (Err: any) => {
          if (Err != undefined) {
            Alert.alert(Err?.message);
          }
        },
      };
      dispatch(canteenRegisterSignUp(obj));
    }
  };

  const onPressCanteenRegister = () => {
    if (selectRole.trim().length === 0) {
      errorToast(strings('login.error_role'));
    } else if (name.trim().length === 0) {
      errorToast(strings('login.error_name'));
    } else if (user_name.trim().length === 0) {
      errorToast(strings('sign_up.user_name_error'));
    } else if (lastName.trim().length === 0) {
      errorToast(strings('login.error_nameLastName'));
    } else if (email.trim().length === 0) {
      errorToast(strings('login.error_email'));
    } else if (!emailCheck(email)) {
      errorToast(strings('login.error_v_email'));
    } else if (number.trim().length === 0) {
      errorToast(strings('login.error_phone'));
    } else if (number.trim().length !== 10) {
      errorToast(strings('login.error_v_phone'));
    } else if (universityName == '') {
      errorToast(strings('login.error_v_university'));
    } else if (canteenName.trim().length == 0) {
      errorToast(strings('login.error_v_canteen'));
    } else if (area.trim().length === 0) {
      errorToast(strings('login.error_address'));
    } else if (city.trim().length === 0) {
      errorToast(strings('login.error_city'));
    } else if (state.trim().length === 0) {
      errorToast(strings('login.error_state'));
    } else if (country.trim().length === 0) {
      errorToast(strings('login.error_country'));
    } else if (pincode.trim().length === 0) {
      errorToast(strings('login.error_pincode'));
    } else if (password.trim().length === 0) {
      errorToast(strings('login.error_password'));
    } else if (password.trim().length < 9) {
      errorToast(strings('login.error_v_password'));
    } else if (!numberCheck(password)) {
      errorToast(strings('login.error_number_password'));
    } else if (!specialCarCheck(password)) {
      errorToast(strings('login.error_character_password'));
    } else if (!UpperCaseCheck(password)) {
      errorToast(strings('login.error_uppercase_password'));
    } else if (rePassword.trim().length === 0) {
      errorToast(strings('login.error_re_tyre'));
    } else if (rePassword.trim() !== password.trim()) {
      errorToast(strings('login.error_re_tyre_match'));
    } else {
      var data = new FormData();
      data.append('name', name);
      data.append('user_name', user_name);
      data.append('last_name', lastName);
      data.append('email', email);
      data.append('password', password);
      data.append('confirmed', rePassword);
      data.append('restaurant_name', canteenName);
      data.append('number', number);
      data.append('address', area);
      data.append('pincode', pincode);
      data.append('city_id', addressList?.id);
      data.append('state_id', addressList?.state?.id);
      data.append('country_id', addressList?.state?.country?.id);
      data.append('role', 'canteen');
      data.append('status', '1');
      data.append('university_id', universityName);
      let obj = {
        data,
        onSuccess: async (response: any) => {
          await setAsyncRole(selectRole);

          dispatchNavigation(screenName.BottomTabBar);
        },
        onFailure: (Err: any) => {
          if (Err != undefined) {
            Alert.alert(Err?.message);
          }
        },
      };
      dispatch(canteenRegisterSignUp(obj));
    }
  };

  const onPressLoginStudent = () => {
    if (selectRole.trim().length === 0) {
      errorToast(strings('login.error_role'));
    } else if (selectUniversity === '') {
      errorToast(strings('StudentSignUp.error_university'));
    } else if (name.trim().length === 0) {
      errorToast(strings('login.error_name'));
    } else if (lastName.trim().length === 0) {
      errorToast(strings('login.error_nameLastName'));
    } else if (email.trim().length === 0) {
      errorToast(strings('login.error_email'));
    } else if (!emailCheck(email)) {
      errorToast(strings('login.error_v_email'));
    } else if (number.trim().length === 0) {
      errorToast(strings('login.error_phone'));
    } else if (number.trim().length !== 10) {
      errorToast(strings('login.error_v_phone'));
    } else if (collegeName.trim().length == 0) {
      errorToast(strings('StudentSignUp.error_colleg_name'));
    } else if (hostelName.trim().length === 0) {
      errorToast(strings('StudentSignUp.error_hostel'));
    } else if (hostelAddress.trim().length === 0) {
      errorToast(strings('StudentSignUp.error_hostel_address'));
    } else if (password.trim().length === 0) {
      errorToast(strings('login.error_password'));
    } else if (password.trim().length < 9) {
      errorToast(strings('login.error_v_password'));
    } else if (!numberCheck(password)) {
      errorToast(strings('login.error_number_password'));
    } else if (!specialCarCheck(password)) {
      errorToast(strings('login.error_character_password'));
    } else if (!UpperCaseCheck(password)) {
      errorToast(strings('login.error_uppercase_password'));
    } else if (rePassword.trim().length === 0) {
      errorToast(strings('login.error_re_tyre'));
    } else if (rePassword.trim() !== password.trim()) {
      errorToast(strings('login.error_re_tyre_match'));
    } else {
      var data = new FormData();
      data.append('name', name);
      data.append('last_name', lastName);
      data.append('email', email);
      data.append('number', number);
      data.append('password', password);
      data.append('confirmed', rePassword);
      data.append('role', 'student');
      data.append('university_id', selectUniversity);
      data.append('status', '1');
      data.append('college_name', collegeName);
      data.append('hostel_name', hostelName);
      data.append('hostel_address', hostelAddress);

      let obj = {
        data,
        onSuccess: async (response: any) => {
          console.log('response', response);
          await setAsyncRole(selectRole);

          dispatchNavigation(screenName.StudentBottomBar);
        },
        onFailure: (Err: any) => {
          if (Err != undefined) {
            Alert.alert(Err?.message);
          }
        },
      };
      dispatch(studentUserSignUp(obj));
    }
  };

  const getCityList = () => {
    let obj = {
      onSuccess: (res: any) => { },
      onFailure: (Err: any) => { },
    };
    dispatch(getCityAction(obj));
  };

  const debouncedFilterSearch = React.useCallback(
    debounce(searchText => {
      let UserInfo = {
        data: searchText,
        onSuccess: res => { },
        onFailure: Err => { },
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

    // let text = searchText?.toLowerCase();
    // let filteredData = getCity?.filter(subItem => {
    //   return subItem?.name?.toLowerCase()?.includes(text);
    // });
    // setFilteredData(filteredData);
  };

  const googlesignIn = async () => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLINET_ID,
      offlineAccess: false,
    });
    try {
      let user = await GoogleSignin.getCurrentUser();
      console.log(user);
      if (user !== null && Object.keys(user).length !== 0) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('GoogleSignin userInfo', userInfo);

      let googleUser = {
        ...userInfo,
        user: {
          ...userInfo.user,
          role: selectRole.toLowerCase(),
        },
      };
      let userObj = {
        data: googleUser,
        onSuccess: async res => {
          await setAsyncRole(selectRole);
          if (res?.university_id) {
            dispatchNavigation(screenName.StudentBottomBar);
          } else {
            dispatchNavigation(screenName.StudentSelect);
          }
        },
        onFailure: (Err: any) => {
          if (Err != undefined) {
            errorToast(Err?.message);
          }
        },
      };
      dispatch(googleEmailAction(userObj));
    } catch (error: any) {
      if (error?.code === statusCodes?.SIGN_IN_CANCELLED) {
        errorToast(strings('googleSignIn.user_cancelled'));
      } else if (error?.code === statusCodes?.IN_PROGRESS) {
        errorToast(strings('googleSignIn.error_text'));
      } else if (error?.code === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
        errorToast(strings('googleSignIn.play_services'));
      } else {
        errorToast(strings('googleSignIn.something_went'));
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={colors.Primary_Bg}
      />

      <LoginHeader
        title={strings('sign_up.sign_up')}
        description={strings('sign_up.sign_dec')}
        isBack={true}
        onPress={() => onPressBack()}
      />

      <View style={styles.bottomContainer}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          contentContainerStyle={styles.contentContainerStyle}>
          {/* <View style={styles.radioView}>
            {options.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.radioContainer}
                onPress={() => handlePress(option.value)}>
                <View
                  style={[
                    styles.radioButton,
                    selectedOption === option.value &&
                      styles.selectedRadioButton,
                  ]}>
                  {selectedOption === option.value && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text
                  style={[
                    styles.radioText,
                    {
                      color:
                        selectedOption === option.value
                          ? colors.Primary_Orange
                          : colors.Title_Text,
                    },
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View> */}
          <CCDropDown
            data={options}
            label={strings('login.select_role')}
            labelField={'name'}
            valueField={'value'}
            placeholder={strings('roleSelection.select_role')}
            DropDownStyle={styles.dropDownStyle}
            value={selectRole}
            setValue={item => {
              setSelectRole(item);
              emptyFiled();
            }}
            extraStyle={styles.extraDropStyle}
          />
          {selectRole === 'Canteen' ? (
            <CCDropDown
              data={getUniversitiesData}
              label={strings('sign_up.university_name')}
              labelField={'name'}
              valueField={'id'}
              placeholder={strings('sign_up.select_university')}
              DropDownStyle={styles.dropDownStyle}
              value={universityName}
              setValue={setUniversityName}
              extraStyle={styles.otherStyle}
            />
          ) : null}
          {selectRole === 'Student' && (
            <CCDropDown
              data={getUniversitiesData}
              label={strings('sign_up.university_name')}
              labelField={'name'}
              valueField={'id'}
              placeholder={strings('sign_up.select_university')}
              DropDownStyle={styles.dropDownStyle}
              value={selectUniversity}
              setValue={setSelectUniversity}
              extraStyle={styles.otherStyle}
            />
          )}

          <Input
            value={name}
            placeholder={strings('sign_up.p_name')}
            label={strings('sign_up.name')}
            onChangeText={(t: string) => setName(t)}
          />
          {selectRole !== 'Student' && (
            <Input
              value={user_name}
              placeholder={strings('sign_up.user_name')}
              label={strings('sign_up.user_name')}
              onChangeText={(t: string) => setUser_name(t)}
            />
          )}
          <Input
            value={lastName}
            placeholder={strings('sign_up.lats_p_name')}
            label={strings('sign_up.last_name')}
            onChangeText={(t: string) => setLastName(t)}
          />

          <Input
            value={email}
            placeholder={strings('sign_up.p_email')}
            label={strings('sign_up.email')}
            onChangeText={(t: string) => setEmail(t)}
          />
          <Input
            value={number}
            placeholder={strings('sign_up.p_enter_number')}
            keyboardType="number-pad"
            label={strings('sign_up.p_enter_number')}
            onChangeText={(t: string) => setNumber(t)}
            maxLength={10}
          />

          {selectRole === 'Restaurant' ? (
            <Input
              value={restaurantName}
              placeholder={strings('sign_up.restaurantName')}
              label={strings('sign_up.restaurantName')}
              onChangeText={(t: string) => setRestaurantName(t)}
            />
          ) : selectRole === 'Canteen' ? (
            <>
              <Input
                value={canteenName}
                placeholder={strings('sign_up.p_enter_canteen')}
                label={strings('sign_up.canteen_name')}
                onChangeText={(t: string) => setCanteenName(t)}
              />
            </>
          ) : null}

          {selectRole !== 'Student' && (
            <>
              <Input
                value={area}
                placeholder={strings('sign_up.p_enter_area')}
                label={strings('sign_up.area')}
                onChangeText={(t: string) => setArea(t)}
              />
              <Input
                value={city}
                placeholder={strings('sign_up.p_enter_cty')}
                label={strings('sign_up.city')}
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
              />
              <Input
                value={state}
                placeholder={strings('sign_up.p_enter_state')}
                label={strings('sign_up.state')}
                onChangeText={(t: string) => setState(t)}
                showListView={false}
              // extraStyle={{ zIndex: -1, width: '48.9%' }}
              />
              <Input
                value={country}
                placeholder={strings('sign_up.p_enter_country')}
                label={strings('sign_up.country')}
                onChangeText={(t: string) => setCountry(t)}
              // extraStyle={{ zIndex: -1, width: '49%' }}
              />

              <Input
                value={pincode}
                placeholder={strings('sign_up.p_enter_pincode')}
                keyboardType="number-pad"
                label={strings('sign_up.pincode')}
                onChangeText={(t: string) => setPincode(t)}
                extraStyle={{ zIndex: -1 }}
              />
            </>
          )}

          {selectRole === 'Student' && (
            <>
              <Input
                value={collegeName}
                placeholder={strings('StudentSignUp.enter_college')}
                label={strings('StudentSignUp.college_name')}
                onChangeText={(t: string) => setCollegeName(t)}
              />
              <Input
                value={hostelName}
                placeholder={strings('StudentSignUp.enter_name')}
                label={strings('StudentSignUp.hostel_name')}
                onChangeText={(t: string) => setHostelName(t)}
              />
              <Input
                value={hostelAddress}
                placeholder={strings('StudentSignUp.enter_hostel_address')}
                label={strings('StudentSignUp.hostel_address')}
                onChangeText={(t: string) => setHostelAddress(t)}
                extraStyle={{ zIndex: -1 }}
              />
            </>
          )}
          <Input
            value={password}
            autoCorrect={false}
            isShowEyeIcon={true}
            secureTextEntry={isShowPassword}
            placeholder={strings('login.password')}
            label={strings('sign_up.password')}
            onChangeText={(t: string) => setPassword(t)}
            onPressEye={() => setIsShowPassword(!isShowPassword)}
            extraStyle={{ zIndex: -1 }}
          />
          <Input
            value={rePassword}
            autoCorrect={false}
            isShowEyeIcon={true}
            placeholder={strings('Phone_number_verification.confirm_password')}
            secureTextEntry={isShowRePassword}
            label={strings('sign_up.re_type_password')}
            onChangeText={(t: string) => setRePassword(t)}
            onPressEye={() => setisShowRePassword(!isShowRePassword)}
          />
          <PrimaryButton
            extraStyle={styles.signupButton}
            onPress={() => {
              selectRole == 'Restaurant'
                ? onPressLogin()
                : selectRole == 'Canteen'
                  ? onPressCanteenRegister()
                  : onPressLoginStudent();
            }}
            title={strings('sign_up.sign_up')}
          />
          {selectRole == 'Student' ? (
            <Text style={styles.orContinueText}>{strings('login.or')}</Text>
          ) : null}
          {selectRole == 'Student' ? (
            <View>
              <TouchableOpacity onPress={googlesignIn} style={styles.roundView}>
                <Image style={styles.twitterIcon} source={Icons.google} />
                <Text style={styles.googleText}>{strings('login.google')}</Text>
              </TouchableOpacity>
              {isIos && (
                <TouchableOpacity style={[styles.roundView]}>
                  <Image style={styles.appleIcon} source={Icons.apple} />
                  <Text style={styles.googleText}>
                    {strings('login.apple')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
          <Spacer height={20} />
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default SignUpScreen;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg_white,
    },
    bottomContainer: {
      flex: 5,
      backgroundColor: colors.bg_white,
    },
    contentContainerStyle: {
      paddingHorizontal: wp(20),
    },
    signupButton: {
      marginTop: hp(12),
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioView: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      paddingTop: hp(15),
    },
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    radioButton: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.black,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedRadioButton: {
      borderColor: colors.Primary_Orange,
    },
    radioButtonInner: {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: colors.Primary_Orange,
    },
    radioText: {
      marginLeft: 10,
      ...commonFontStyle(400, 14, colors.Title_Text),
    },
    // dropDownStyle: {
    //   borderColor: colors.inputColor,
    //   backgroundColor: colors.inputColor,
    //   height: hp(60),
    //   borderRadius: 10,
    // },
    dropDownStyle: {
      borderColor: colors.input_border,
      backgroundColor: colors.input_bg,
      height: hp(56),
      borderRadius: 32,
      paddingHorizontal: wp(25),
      marginTop: hp(12),
    },
    otherStyle: {
      marginTop: hp(8),
    },
    extraDropStyle: {
      marginTop: hp(12),
    },
    roundView: {
      height: wp(48),
      borderRadius: wp(60) / 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp(12),
      backgroundColor: colors.defult_white,
      borderWidth: 1,
      flexDirection: 'row',
      borderColor: colors.input_border1,
    },
    facebookIcon: {
      height: hp(18),
      width: wp(9),
      resizeMode: 'contain',
    },
    twitterIcon: {
      height: wp(18),
      width: wp(17),
      resizeMode: 'contain',
    },
    googleText: {
      ...commonFontStyle(700, 15, colors.text_gray),
      paddingLeft: wp(10),
    },
    appleIcon: {
      height: hp(18),
      width: wp(14),
      resizeMode: 'contain',
    },
    orContinueText: {
      ...commonFontStyle(400, 14, colors.title_dec),
      marginTop: hp(12),
      textAlign: 'center',
    },
  });
};
