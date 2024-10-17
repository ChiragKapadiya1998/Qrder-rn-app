import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { useNavigation, useTheme } from '@react-navigation/native';
import { hp, wp } from '../../theme/fonts';
import Input from '../../compoment/Input';
import PrimaryButton from '../../compoment/PrimaryButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoginHeader from '../../compoment/LoginHeader';
import { screenName } from '../../navigation/screenNames';
import { strings } from '../../i18n/i18n';
import CCDropDown from '../../compoment/CCDropDown';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  emailCheck,
  errorToast,
  numberCheck,
  specialCarCheck,
  UpperCaseCheck,
} from '../../utils/commonFunction';
import { chefsSignUp } from '../../actions/chefsAction';
import Spacer from '../../compoment/Spacer';
import { getAsyncUserInfo } from '../../utils/asyncStorageManager';
import { dispatchNavigation, openImagePicker } from '../../utils/globalFunctions';
import HomeHeader from '../../compoment/HomeHeader';
import { Icons } from '../../utils/images';

type Props = {};

const ChefSignUp = (props: Props) => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState < string > ('');
  const [password, setPassword] = useState('');
  const [salary, setSalary] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState < boolean > (true);
  const [reShowPassword, setReShowPassword] = useState < boolean > (true);
  const [quantityValue, setQuantityValue] = useState(0);
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getCuisines } = useAppSelector(state => state.data);
  const { isDarkTheme } = useAppSelector(state => state.common);
  const [imageData, setImageData] = useState < any > ({
    uri: '',
  });
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const onPressLogin = async () => {
    if (imageData?.uri === '') {
      errorToast(strings('addFoodList.selectImg'));
    } else if (name.trim().length === 0) {
      errorToast(strings('login.error_name'));
    } else if (email.trim().length === 0) {
      errorToast(strings('login.error_email'));
    } else if (!emailCheck(email)) {
      errorToast(strings('login.error_v_email'));
    } else if (quantityValue == 0) {
      errorToast(strings('chefSignUp.select_cusine_error'));
    } else if (phone.trim().length === 0) {
      errorToast(strings('login.error_phone'));
    } else if (phone.trim().length !== 10) {
      errorToast(strings('login.error_v_phone'));
    } else if (salary == 0) {
      errorToast(strings('login.error_v_salary'));
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
      setLoading(true)
      var data = new FormData();
    
      data.append('name', name);
      data.append('email', email);
      data.append('cuisine_id', quantityValue);
      data.append('number', phone);
      data.append('password', password);
      data.append('confirmed', rePassword);
      data.append('salary', salary);
      data.append('profile_image', {
        uri: imageData?.uri,
        type: imageData?.mime,
        name: imageData?.name,
      });
      let obj = {
        data,
        onSuccess: (response: any) => {
          setLoading(false)
          navigation.goBack();
          setName('');
          setEmail('');
          setQuantityValue(0);
          setPhone('');
          setPassword('');
          setRePassword('');
          setSalary(0);
        },
        onFailure: (Err: any) => {
          setLoading(false)
          if (Err != undefined) {
            Alert.alert(Err?.message);
          }
        },
      };
      dispatch(chefsSignUp(obj));
    }
  };

  const onPressBack = () => {
    navigation.goBack();
  };


  const selectImage = () => {
    openImagePicker({
      onSucess: res => {
        setImageData(res);
      },
    });
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
        title={strings('chefSignUp.create_chef')}
        isShowIcon={false}
        extraStyle={styles.headerContainer}
        isHideIcon={true}
        rightTextStyle={styles.rightTextStyle}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.profileContainer}>
          <View>
            <Image
              source={
                imageData?.uri ? { uri: imageData?.uri } : Icons.profileImage
              }
              style={styles.profilImage}
            />
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={selectImage}
              style={styles.editImage}>
              <Image source={Icons.editPencial} style={styles.profileIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <Input
          value={name}
          placeholder={strings('sign_up.name')}
          label={strings('sign_up.name')}
          onChangeText={(t: string) => setName(t)}
          isShowLabel={true}
          inputStyle={styles.inputStyle}
        />
        <Input
          value={email}
          placeholder={strings('sign_up.p_email')}
          label={strings('sign_up.email')}
          onChangeText={(t: string) => setEmail(t)}
          isShowLabel={true}
          inputStyle={styles.inputStyle}
        />
        <CCDropDown
          data={getCuisines}
          label={strings('addFoodList.select_cusine')}
          labelField={'name'}
          valueField={'id'}
          placeholder={strings('addFoodList.select_cusine')}
          DropDownStyle={styles.dropDownStyle}
          value={quantityValue}
          setValue={setQuantityValue}
          extraStyle={styles.otherStyle}
          isShowLabel={true}
        />
        <Input
          value={phone}
          returnKeyType="next"
          placeholder={strings('sign_up.p_enter_phone')}
          label={strings('chefSignUp.phone_Number')}
          keyboardType="number-pad"
          maxLength={10}
          onChangeText={(t: string) => setPhone(t.trim())}
          isShowLabel={true}
          inputStyle={styles.inputStyle}
        />
        <Input
          value={salary}
          autoCorrect={false}
          placeholder={strings('chefSignUp.p_salary')}
          label={strings('chefSignUp.salary')}
          keyboardType="number-pad"
          maxLength={10}
          onChangeText={(t: string) => setSalary(t.trim())}
          isShowLabel={true}
          inputStyle={styles.inputStyle}
        />
        <Input
          value={password}
          autoCorrect={false}
          isShowEyeIcon={true}
          secureTextEntry={isShowPassword}
          placeholder={strings('sign_up.password')}
          label={strings('sign_up.password')}
          onChangeText={(t: string) => setPassword(t)}
          onPressEye={() => setIsShowPassword(!isShowPassword)}
          isShowLabel={true}
          inputStyle={styles.inputStyle}
        />
        <Input
          value={rePassword}
          autoCorrect={false}
          isShowEyeIcon={true}
          placeholder={strings('Phone_number_verification.confirm_password')}
          secureTextEntry={reShowPassword}
          label={strings('Phone_number_verification.confirm_password')}
          onChangeText={(t: string) => setRePassword(t)}
          onPressEye={() => setReShowPassword(!reShowPassword)}
          isShowLabel={true}
          inputStyle={styles.inputStyle}
        />

        <PrimaryButton
          extraStyle={styles.signupButton}
          onPress={onPressLogin}
          title={strings('PersonalInfo.save_details')}
          isLoading={loading}
        />
        <Spacer height={hp(20)} />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ChefSignUp;

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
    rightTextStyle: {
      textDecorationLine: 'underline',
      textTransform: 'uppercase',
    },
    contentContainerStyle: {
      paddingHorizontal: wp(20),
      marginTop: hp(3),
    },
    signupButton: {
      marginTop: hp(28),
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
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
      backgroundColor: colors.bg_orange200,
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
    dropDownStyle: {
      borderColor: colors.text_orange,
      backgroundColor: colors.input_bg,
      height: hp(56),
      borderRadius: 32,
      paddingHorizontal: wp(25),
    },
    otherStyle: {
      marginTop: hp(8),
    },
    inputStyle: {
      borderColor: colors.text_border,
    },
  });
};
