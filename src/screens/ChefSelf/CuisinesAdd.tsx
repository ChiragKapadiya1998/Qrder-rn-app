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
import { useNavigation, useTheme } from '@react-navigation/native';
import HomeHeader from '../../compoment/HomeHeader';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { strings } from '../../i18n/i18n';
import { commonFontStyle, hp, SCREEN_WIDTH, wp } from '../../theme/fonts';
import Input from '../../compoment/Input';
import { Icons } from '../../utils/images';
import ImageCropPicker from 'react-native-image-crop-picker';
import PrimaryButton from '../../compoment/PrimaryButton';
import Spacer from '../../compoment/Spacer';
import { errorToast, infoToast } from '../../utils/commonFunction';
import { addCuisinesAction } from '../../actions/cuisinesAction';
import { getAsyncUserInfo } from '../../utils/asyncStorageManager';
import { openImagePicker } from '../../utils/globalFunctions';

export interface ListObj {
  title: string;
  iconName?: any;
  images?: string[];
  name?: string;
  cuisine_name?: string;
  price?: number;
}
type ItemProps = {
  item: ListObj;
};

const CuisinesAdd = ({ item }: ItemProps) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [cuisineName, seCuisineName] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isDarkTheme } = useAppSelector(state => state.common);
  const dispatch = useAppDispatch();
  const [imageData, setImageData] = useState < any > ({
    uri: '',
  });
  const [isPictureEdit, setIsPictureEdit] = useState < boolean > (false);

  const onPressNewAdd = async () => {
    if (cuisineName.length == '') {
      errorToast(strings('addFoodList.error_enter'));
    } else if (imageData?.uri === '') {
      errorToast(strings('addFoodList.selectImg'));
    } else {
      setLoading(true);
      let data = new FormData();
      data.append('name', cuisineName);
      data.append('file', {
        uri: imageData?.uri,
        type: imageData?.mime,
        name: imageData?.name,
      });
      let obj = {
        data,
        onSuccess: (response: any) => {
          navigation.goBack();
          seCuisineName('');
          setLoading(false);
        },
        onFailure: (Err: any) => {
          if (Err != undefined) {
            // Alert.alert('Warning', Err?.message);
          }
          setLoading(false);
        },
      };
      dispatch(addCuisinesAction(obj));
    }
  };

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const onPressDelete = () => {
    setDelete(true);
  };


  const selectImage = () => {
    openImagePicker({
      onSucess: res => {
        if (res.size > 2 * 1024 * 1024) {
          errorToast(strings('newAddText.e_up_mb'))
          return;
        }
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
        onBackPress={() => {
          navigation.goBack();
        }}
        mainShow={true}
        title={strings('CuisinesNameList.add_cuisines')}
        extraStyle={styles.headerContainer}
        isShowIcon={false}
      />
      <View style={styles.contentContainer}>
        <Input
          value={cuisineName}
          placeholder={strings('CuisinesNameList.enter_cuisine_name')}
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
              style={[styles.addImageView, { borderWidth: 1 }]}
              onPress={() => {
                selectImage();
              }}>
              <Image source={Icons.addImageIcon} style={styles.addImageIcon} />
              <Text style={styles.addImageText}>
                {strings('CuisinesNameList.add_photo')}
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
                source={{ uri: imageData.uri }}
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
          onPress={onPressNewAdd}
          title={strings('CuisinesNameList.submit')}
          titleStyle={styles.submitText}
          isLoading={loading}
        />
        <Spacer width={16} />
        <PrimaryButton
          extraStyle={styles.cancelBtn}
          // onPress={onPressEditDone}
          title={strings('CuisinesNameList.cancel')}
          titleStyle={styles.cancelText}
        />
      </View>
    </View>
  );
};
export default CuisinesAdd;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg_white,
    },
    contentContainer: {
      flex: 1,
      marginHorizontal: wp(20),
    },
    headerContainer: {
      paddingBottom: hp(4)
    },
    profileContainer: {
      justifyContent: 'flex-start',
      alignSelf: 'flex-start',
      //   alignItems: 'center',
      marginTop: hp(11),
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
    upToText: {
      ...commonFontStyle(500, 12, colors.title_dec100),
    }
  });
};
