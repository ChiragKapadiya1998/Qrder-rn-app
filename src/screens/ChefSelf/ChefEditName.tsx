import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CCDropDown from '../../compoment/CCDropDown';
import Spacer from '../../compoment/Spacer';
import { getAsyncUserInfo } from '../../utils/asyncStorageManager';
import { chefsNameEdit } from '../../actions/chefsAction';
import { openImagePicker } from '../../utils/globalFunctions';

type Props = {};

const ChefEditName = (props: Props) => {
  const route = useRoute();
  const { itemData } = route?.params;
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const { isDarkTheme } = useAppSelector(state => state.common);
  const { getCuisines } = useAppSelector(state => state.data);
  const [name, setName] = useState < string > (itemData?.name);
  const [email, setEmail] = useState < string > (itemData?.email);
  const [quantityValue, setQuantityValue] = useState(0);
  const [number, setNumber] = useState < string > (itemData?.number);
  const [salary, setSalary] = useState(itemData?.salary.toString());
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState < any > ({
    uri: itemData.profile_image ? itemData.profile_image : '',
  });
  const [isPictureEdit, setIsPictureEdit] = useState < boolean > (
    itemData.profile_image ? true : false,
  );

  useEffect(() => {
    const filteredItem = getCuisines.find(
      (item: any) => item.name === itemData.cuisine_name,
    );
    if (filteredItem) {
      setQuantityValue(filteredItem.id);
    }
  }, [getCuisines, itemData.cuisine_name]);

  const selectImage = () => {
    openImagePicker({
      onSucess: res => {
        setImageData(res);
      },
    });
  };
  
  const onPressEditDone = async () => {
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
    } else if (number.trim().length === 0) {
      errorToast(strings('login.error_phone'));
    } else if (number.trim().length !== 10) {
      errorToast(strings('login.error_v_phone'));
    } else if (salary.trim().length === 0) {
      errorToast(strings('ChefNameList.error_v_salary'));
    } else {
      setLoading(true)
      var data = new FormData();
     
      data.append('name', name);
      data.append('email', email);
      data.append('cuisine_id', quantityValue);
      data.append('number', number);
      data.append('salary', salary);
      if (imageData?.uri !== itemData.profile_image) {
        data.append('profile_image', {
          uri: imageData?.uri,
          type: imageData?.mime,
          name: imageData?.name,
        });
      }
   
      let obj = {
        id: itemData?.id,
        data,
        onSuccess: (response: any) => {
          setLoading(false)
          navigation.goBack();
        },
        onFailure: (Err: any) => {
          setLoading(false)
          if (Err != undefined) {
            Alert.alert(Err?.message);
          }
        },
      };
      dispatch(chefsNameEdit(obj));
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
        title={strings('ChefNameList.edit_Chef_name')}
        isShowIcon={false}
        extraStyle={styles.headerContainer}
        isHideIcon={true}
        rightTextStyle={styles.rightTextStyle}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={styles.contentContainerStyle}>
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
            <TouchableOpacity activeOpacity={0.9} onPress={selectImage} style={styles.editImage}>
              <Image source={Icons.editPencial} style={styles.profileIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <Input
          value={name}
          placeholder={strings('sign_up.p_name')}
          label={strings('sign_up.first_name')}
          onChangeText={(t: string) => setName(t)}
          isShowLabel={true}
        />
        <Input
          value={email}
          placeholder={strings('sign_up.p_email')}
          label={strings('sign_up.email_address')}
          onChangeText={(t: string) => setEmail(t)}
          isShowLabel={true}
        />
        <CCDropDown
          data={getCuisines}
          label={strings('addFoodList.select_cusine')}
          placeholder={strings('addFoodList.select_cusine')}
          labelField={'name'}
          valueField={'id'}
          DropDownStyle={styles.dropDownStyle}
          value={quantityValue}
          setValue={setQuantityValue}
          extraStyle={styles.extraStyle}
          isShowLabel={true}
        />
        <Input
          value={number}
          keyboardType="number-pad"
          placeholder={strings('sign_up.p_enter_phone')}
          label={strings('chefSignUp.phone_Number')}
          onChangeText={(t: string) => setNumber(t)}
          maxLength={10}
          isShowLabel={true}
        />
        <Input
          value={salary}
          placeholder={strings('chefSignUp.p_salary')}
          label={strings('chefSignUp.salary')}
          keyboardType="number-pad"
          onChangeText={(t: string) => setSalary(t)}
          isShowLabel={true}
        />
        <PrimaryButton
          extraStyle={styles.signupButton}
          onPress={onPressEditDone}
          title={strings('PersonalInfo.save_details')}
          isLoading={loading}
        />
        <Spacer height={10} />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ChefEditName;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg_white,
    },
    headerContainer: {
      backgroundColor: colors.bg_white,
      // paddingBottom:hp(3)
    },
    contentContainerStyle: {
      marginHorizontal: wp(20),
    },
    rightTextStyle: {
      textDecorationLine: 'underline',
      textTransform: 'uppercase',
    },
    profileContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: hp(3),
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
      marginTop: hp(28),
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
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
