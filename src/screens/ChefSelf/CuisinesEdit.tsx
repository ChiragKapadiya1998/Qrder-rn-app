import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import HomeHeader from '../../compoment/HomeHeader';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {strings} from '../../i18n/i18n';
import {commonFontStyle, hp, SCREEN_WIDTH, wp} from '../../theme/fonts';
import Input from '../../compoment/Input';
import {Icons} from '../../utils/images';
import ImageCropPicker from 'react-native-image-crop-picker';
import PrimaryButton from '../../compoment/PrimaryButton';
import Spacer from '../../compoment/Spacer';
import {infoToast} from '../../utils/commonFunction';
import {
  addCuisinesAction,
  editCuisinesAction,
} from '../../actions/cuisinesAction';
import {getAsyncUserInfo} from '../../utils/asyncStorageManager';
import {openImagePicker} from '../../utils/globalFunctions';

const CuisinesEdit = () => {
  const {colors} = useTheme();
  const route = useRoute();
  const {selectList} = route?.params;
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [cuisineName, seCuisineName] = useState(selectList?.name);
  const [photoUri, setPhotoUri] = useState(selectList?.image);
  const [loading, setLoading] = useState(false);
  const {isDarkTheme} = useAppSelector(state => state.common);
  const dispatch = useAppDispatch();
  const [imageData, setImageData] = useState<any>({
    uri: selectList?.image ? selectList?.image : '',
  });
  const [isPictureEdit, setIsPictureEdit] = useState<boolean>(
    selectList?.image ? true : false,
  );

  console.log('selectList?.image', cuisineName);

  const onPressEdit = async () => {
    if (cuisineName == '') {
      infoToast(strings('addFoodList.error_enter'));
    } else {
      setLoading(true);
      const userDetails = await getAsyncUserInfo();
      let data = new FormData();

      data.append('name', cuisineName);
      //   data.append('parent_id', userDetails?.id);

      if (imageData?.uri !== selectList?.image) {
        data.append('file', {
          uri: imageData?.uri,
          type: imageData?.mime,
          name: imageData?.name,
        });
      }
      let obj = {
        id: selectList?.id,
        data,
        onSuccess: (response: any) => {
          navigation.goBack();
          setLoading(false);
        },
        onFailure: (Err: any) => {
          if (Err != undefined) {
            // Alert.alert('Warning', Err?.message);
          }
          setLoading(false);
        },
      };
      dispatch(editCuisinesAction(obj));
    }
  };

  const goback = () => {
    navigation.goBack();
  };

  // const selectImage = () => {
  //     setLoading(true);
  //     ImageCropPicker.openPicker({
  //         width: 100,
  //         height: 100,
  //         cropping: true,
  //     })
  //         .then(image => {
  //             setPhotoUri(image.path);
  //             setLoading(false);
  //         })
  //         .catch(error => {
  //             console.log(error);
  //             setLoading(false);
  //         });
  // };

  const selectImage = () => {
    openImagePicker({
      onSucess: res => {
        console.log('res', res);
        setImageData(res);
        setIsPictureEdit(true);
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
        onBackPress={goback}
        mainShow={true}
        title={strings('CuisinesNameList.edit_Cuisines_name')}
        extraStyle={styles.headerContainer}
        isShowIcon={false}
      />
      <View style={styles.contentContainer}>
        <Input
          value={cuisineName}
          placeholder={strings('CuisinesNameList.add_cuisines')}
          label={strings('CuisinesNameList.cuisines_name')}
          onChangeText={(t: string) => seCuisineName(t)}
          isShowLabel={true}
          inputStyle={styles.inputStyle}
        />
        <View style={styles.profileContainer}>
          <Text style={styles.uploadText}>
            {strings('addFoodList.upload_photo_video')}
          </Text>
          {!isPictureEdit ? (
            <TouchableOpacity
              style={[styles.addImageView, {borderWidth: 1}]}
              onPress={() => {
                selectImage();
              }}>
              <Image source={Icons.addImageIcon} style={styles.addImageIcon} />
              <Text style={styles.addImageText}>
                {strings('addFoodList.add_food_photo')}
              </Text>
              <Text style={styles.upToText}>
                {strings('addFoodList.upToMb')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addImageView}
              onPress={() => {
                selectImage();
              }}>
              <Image
                source={{uri: imageData.uri}}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'stretch',
                  borderRadius: 16,
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          extraStyle={styles.submitButton}
          onPress={onPressEdit}
          title={strings('CuisinesNameList.submit')}
          titleStyle={styles.submitText}
          isLoading={loading}
        />
        <Spacer width={16} />
        <PrimaryButton
          extraStyle={styles.cancelBtn}
          onPress={goback}
          title={strings('CuisinesNameList.cancel')}
          titleStyle={styles.cancelText}
        />
      </View>
    </View>
  );
};
export default CuisinesEdit;

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg_white,
    },
    contentContainer: {
      flex: 1,
      marginHorizontal: wp(20),
    },
    profileContainer: {
      justifyContent: 'flex-start',
      alignSelf: 'flex-start',
      //   alignItems: 'center',
      marginTop: hp(30),
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
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: wp(20),
      paddingBottom: hp(10),
    },
    submitButton: {
      flex: 1,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelBtn: {
      flex: 1,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
      borderColor: colors.text_gray,
      borderWidth: 1,
    },
    submitText: {
      ...commonFontStyle(600, 18, colors.defult_white),
    },
    cancelText: {
      ...commonFontStyle(600, 18, colors.title_dec100),
    },
    uploadText: {
      ...commonFontStyle(500, 18, colors.black),
      lineHeight: 20,
    },

    addImageView: {
      backgroundColor: colors.cards_bg,
      width: SCREEN_WIDTH * 0.892,
      height: hp(161),

      borderColor: colors.image_bg,
      borderRadius: 16,
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: hp(8),
    },
    addImageIcon: {
      width: 54,
      height: 54,
      resizeMode: 'contain',
    },
    addImageText: {
      paddingTop: hp(16),
      paddingBottom: hp(8),
      ...commonFontStyle(700, 15, colors.text_orange),
    },
  });
};
