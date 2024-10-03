import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';
import HomeHeader from '../../compoment/HomeHeader';
import { strings } from '../../i18n/i18n';
import Input from '../../compoment/Input';
import { commonFontStyle, hp, isIos, SCREEN_WIDTH, wp } from '../../theme/fonts';
import { Icons } from '../../utils/images';
import ImagePicker from 'react-native-image-crop-picker';
import CCDropDown from '../../compoment/CCDropDown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PrimaryButton from '../../compoment/PrimaryButton';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addMenuAction } from '../../actions/menuAction';
import { errorToast } from '../../utils/commonFunction';
import moment = require('moment');
import AddFolderModal from '../../compoment/AddFolderModal';
import Spacer from '../../compoment/Spacer';
import { getCuisinesAction } from '../../actions/cuisinesAction';
import { screenName } from '../../navigation/screenNames';
import ImageCropPicker from 'react-native-image-crop-picker';
import { openImagePicker, options } from '../../utils/globalFunctions';

type DataItem = {
  id: number;
  name: string;
  price: string;
  tenant_id: string;
};

const AddFoodDetails = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [basicDetails, setBasicDetails] = useState('');
  const [percentageInput, setPercentageInput] = useState('');
  const [images, setImages] = useState('');
  const [imageData, setImageData] = useState < any > ({
    uri: '',
  });
  const [isPictureEdit, setIsPictureEdit] = useState < boolean > (false);

  const [quantityValue, setQuantityValue] = useState(0);
  const { getCuisines, getMiscellaneous } = useAppSelector(state => state.data);
  const dispatch = useAppDispatch();
  const [newFolder, setNewFolder] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [selectedOption, setSelectedOption] = useState < number | null > (null);
  const [loading, setLoading] = useState < boolean > (false);
  const [selectedTex, setSelectedTex] = useState(0)
  const isFocuse = useIsFocused();

  const [miscellaneous, setMiscellaneous] = useState(
    getMiscellaneous.map(item => {
      return { ...item, isSelect: false };
    }),
  );

  useEffect(() => {
    getCuisinesList();
  }, [showAddField]);

  useEffect(() => {
    setMiscellaneous(
      getMiscellaneous.map(item => {
        return { ...item, isSelect: false };
      }),
    );
    return () => {
      setSelectedTex(0)
    }
  }, [isFocuse]);

  const getCuisinesList = () => {
    let obj = {
      data: {
        page: 1,
        limit: 15,
        pagination: false,
      },
      onSuccess: (res: any) => { },
      onFailure: (Err: any) => { },
    };
    dispatch(getCuisinesAction(obj));
  };

  const selectImage = () => {
    openImagePicker({
      onSucess: res => {
        setImageData(res);
        setIsPictureEdit(true);
      },
    });
  };

  const selectAndCropImage = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
    })
      .then(selectedImages => {
        const cropPromises = selectedImages.map(image => {
          return ImagePicker.openCropper({
            path: image.path,
            width: 300,
            height: 300,
          });
        });

        Promise.all(cropPromises)
          .then(croppedImages => {
            const newImages = croppedImages.map(image => ({
              ...image,
              name:
                'image_' + moment().unix() + '_' + image.path.split('/').pop(),
              uri: image.path,
              id: image.path,
            }));
            setImages([...newImages, ...images]);
          })
          .catch(error => {
            console.log('Error cropping images:', error);
          });
      })
      .catch(error => {
        console.log('Error selecting images:', error);
      });
  };

  const renderImage = ({ item }: any) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.uri }} style={styles.imageView} />
    </View>
  );

  const onPressAddItem = () => {
    if (imageData.uri == '') {
      errorToast(strings('addFoodList.selectImg'));
    } else if (itemName.trim().length === 0) {
      errorToast(strings('addFoodList.item_name_error'));
    } else if (price.trim().length === 0) {
      errorToast(strings('addFoodList.price_error'));
    } else if (quantityValue == 0) {
      errorToast(strings('addFoodList.cuisines_error'));
    } else if (basicDetails.trim().length === 0) {
      errorToast(strings('addFoodList.basicDetails'));
    } else {
      setLoading(true);
      let data = new FormData();
      const texPre = selectedTex === 0 ? 0 : Number(percentageInput)
      const listData=miscellaneous.filter(list => list.isSelect == true).map((item) => { return item.id })

      data.append('name', itemName);
      data.append('cuisine_id', quantityValue);
      data.append('price', price);
      data.append('description', basicDetails);
      data.append('include_tax', selectedTex);
      data.append('tax_percentage', texPre);
      data.append('miscellaneous_item_ids', `[${listData}]`);
      data.append('file', {
        uri: imageData?.uri,
        type: imageData?.mime,
        name: imageData?.name,
      });

      let obj = {
        data,
        onSuccess: (response: any) => {
          navigation.navigate(screenName.tab_bar_name.MenuList)
          setLoading(false);
          setImages();
          setItemName('');
          setPrice('');
          setQuantityValue(0);
          setBasicDetails('');
          setPercentageInput('');
          setImageData({ uri: '' });
          setIsPictureEdit(false);
          setMiscellaneous(
            getMiscellaneous.map(item => {
              return { ...item, isSelect: false };
            }),
          );
          // Keyboard.dismiss()
        },
        onFailure: (Err: any) => {
          setLoading(false);
          if (Err != undefined) {
            Alert.alert(Err?.data?.message);
          }
        },
      };
      dispatch(addMenuAction(obj));
    }
  };

  const onRightPress = () => {
    setImages('');
    setItemName('');
    setPrice('');
    setQuantityValue(0);
    setBasicDetails('');
  };

  const handlePress = (value: number) => {
    const update = miscellaneous.map(item => {
      if (item?.id == value.id) {
        return { ...value, isSelect: !value?.isSelect };
      } else {
        return { ...item };
      }
    });
    setMiscellaneous(update);
  };

  const handleChangeText = (text) => {
    const value = parseFloat(text);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setPercentageInput(text);
    } else if (text.length === 0) {
      setPercentageInput('');
    } else {
      ToastAndroid.showWithGravity(
        strings('addFoodList.e_Tex_Per'),
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  };

  const renderItem: ListRenderItem<DataItem> = ({ item }: any) => (
    <View style={styles.radioView}>
      <TouchableOpacity
        key={item.id}
        style={styles.radioContainer}
        onPress={() => handlePress(item)}>
        <View
          style={[
            styles.checkbox,
            item?.isSelect == true && styles.selectedCheckbox,
          ]}>
          {item?.isSelect == true && (
            <Image style={styles.ic_check} source={Icons.ic_check} />
          )}
        </View>
        <Text
          style={[
            styles.radioText,
            {
              // color:
              //   item?.isSelect == true
              //     ? colors.Primary_Orange
              //     : colors.Title_Text,
            },
          ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
      <Spacer width={12} />
    </View>
  );
  // if (showAddField) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         backgroundColor: colors.white,
  //       }}>
  //       <TouchableOpacity
  //         onPress={() => {
  //           navigation.navigate(screenName.CuisinesNameList);
  //           // setNewFolder(true);
  //         }}
  //         style={styles.boxStyle}>
  //         <Image source={Icons.cuisine} style={styles.imageStyle} />
  //         <Text style={styles.boxText}>
  //           {strings('addFoodList.add_cuisines')}
  //         </Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         onPress={() => setShowAddField(false)}
  //         style={styles.boxStyle}>
  //         <Image source={Icons.addMenu1} style={styles.imageStyle} />

  //         <Text style={styles.boxText}>{strings('addFoodList.add_menu')}</Text>
  //       </TouchableOpacity>
  //       <AddFolderModal
  //         isVisible={newFolder}
  //         onClose={() => setNewFolder(false)}
  //       />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <HomeHeader
        onBackPress={() => {
          navigation.goBack();
        }}
        onRightPress={() => { }}
        mainShow={true}
        title={strings('addFoodList.add_items')}
        extraStyle={styles.headerContainer}
        isHideIcon={true}
      // rightText={strings('addFoodList.reset')}
      />
      <View style={styles.subContainer}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}>
          <Text style={styles.uploadText}>
            {strings('addFoodList.upload_photo_video')}
          </Text>


          {!isPictureEdit ? (
            <TouchableOpacity style={styles.addImageView} onPress={() => {
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
            <TouchableOpacity style={styles.addImageView} onPress={() => {
              selectImage();
            }}>
              <Image source={{ uri: imageData.uri }} style={{
                width: '100%',
                height: '100%',
                resizeMode: 'stretch',
                borderRadius: 16,
              }} />
            </TouchableOpacity>
          )}
          {/* <View style={styles.uploadImage}> */}
          {/* <TouchableOpacity
              style={styles.addImage}
              onPress={selectAndCropImage}>
              <Image style={styles.addIcon} source={Icons.addImage} />
              <Text style={styles.addText}>{strings('addFoodList.add')}</Text>
            </TouchableOpacity> */}

          {/* <FlatList
              data={images}
              renderItem={renderImage}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              horizontal
              style={styles.imageList}
            /> */}
          {/* </View> */}
          <Input
            value={itemName}
            placeholder={strings('addFoodList.item_name')}
            label={strings('addFoodList.item_name')}
            onChangeText={(t: string) => setItemName(t)}
            extraStyle={styles.inputView}
            inputStyle={styles.inputStyle}
            isShowLabel={true}
          />
          {/* <View style={styles.itemPrice}> */}
          <Input
            value={price}
            placeholder={strings('addFoodList.Addprice')}
            label={strings('addFoodList.price')}
            onChangeText={(t: string) => setPrice(t)}
            extraStyle={styles.priceInput}
            inputStyle={styles.priceInputStyle}
            keyboardType="number-pad"
            isShowLabel={true}
          />
          <CCDropDown
            data={getCuisines}
            label={strings('addFoodList.SelectCuisine')}
            labelField={'name'}
            valueField={'id'}
            placeholder={strings('addFoodList.SelectCuisine')}
            DropDownStyle={styles.dropDownStyle}
            value={quantityValue}
            setValue={setQuantityValue}
            isShowLabel={true}
          />
          {/* </View> */}

          <Text style={[styles.textStyle]}>
            {strings('addFoodList.PriceWithTax')}
          </Text>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: index === 0 ? 0 : 16 }}
              onPress={() => setSelectedTex(index)}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  backgroundColor: selectedTex === index ? colors.blue : 'transparent',
                  borderColor: selectedTex === index ? colors.blue : colors.title_dec,
                  borderWidth: selectedTex === index ? 0 : 1,
                }}
              >
                {selectedTex === index && <Image source={option.icon} style={styles.ic_check} />}
              </View>
              <Text style={styles.text1}>{option.label}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.textStyle}>
            {strings('addFoodList.TaxPercentage')}
          </Text>
          <View
            style={[
              styles.PercentageInput,
              {
                borderColor:
                  percentageInput?.length == 0
                    ? colors.border_line4
                    : colors.text_orange,
              },
            ]}>
            <TextInput
              value={percentageInput}
              onChangeText={handleChangeText}
              placeholder={strings('addFoodList.add_basic')}
              style={styles.inputTaxPercentage}
              placeholderTextColor={colors.title_dec100}
              keyboardType="numeric"
            />
            <Image source={Icons.pertenge} style={styles.pertenge} />
          </View>

          <View>
            <Text style={styles.miscellaneousText}>
              {strings('addFoodList.Miscellaneousitems')}
            </Text>
            <FlatList
              data={miscellaneous}
              renderItem={renderItem}
              horizontal={false}
              keyExtractor={item => item.value}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{gap:12}}
            />
          </View>

          <Input
            value={basicDetails}
            placeholder={strings('addFoodList.Adddescription')}
            label={strings('addFoodList.Description')}
            onChangeText={(t: string) => setBasicDetails(t)}
            extraStyle={styles.inputView}
            inputStyle={styles.inputStyle}
            isShowLabel={true}
          />

          {/* <TextInput
            value={basicDetails}
            onChangeText={(t: string) => setBasicDetails(t)}
            placeholder={strings('addFoodList.Adddescription')}
            style={[
              styles.basicInput,
              {
                borderColor:
                  basicDetails?.length == 0
                    ? colors.border_line4
                    : colors.text_orange,
              },
            ]}
            multiline
            maxLength={200}
            placeholderTextColor={colors.gray_300}
          /> */}
          {/* <PrimaryButton
            extraStyle={styles.saveChangeButton}
            onPress={onPressAddItem}
            title={strings('addFoodList.save_changes')}
            titleStyle={styles.saveText}
            isLoading={loading}
          /> */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              extraStyle={styles.submitButton}
              onPress={onPressAddItem}
              title={strings('CuisinesNameList.submit')}
              titleStyle={styles.submitText}
              isLoading={loading}
            />
            <Spacer width={16} />
            <PrimaryButton
              extraStyle={styles.cancelBtn}
              onPress={() => {
                navigation.goBack();
              }}
              title={strings('CuisinesNameList.cancel')}
              titleStyle={styles.cancelText}
            />
          </View>
          <View style={styles.spacerView} />
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default AddFoodDetails;

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
    subContainer: {
      marginHorizontal: wp(20),
    },
    addItem: {
      width: SCREEN_WIDTH * 0.9,
      height: 190,
      resizeMode: 'contain',
      marginTop: 10,
      borderRadius: 10,
    },
    inputView: {
      marginTop: hp(6),
    },
    inputStyle: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border_line4,
      // height: hp(50),
      paddingHorizontal: wp(16),
    },
    uploadText: {
      ...commonFontStyle(500, 18, colors.black),
      lineHeight: 20,
    },
    addImageView: {
      backgroundColor: colors.cards_bg,
      width: SCREEN_WIDTH * 0.892,
      height: hp(161),
      borderWidth: 1,
      borderColor: colors.image_bg,
      borderRadius: 16,
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: hp(8)
    },
    addImageIcon: {
      width: 54,
      height: 54,
      resizeMode: 'contain'
    },
    addImageText: {
      paddingTop: hp(16),
      paddingBottom: hp(8),
      ...commonFontStyle(700, 15, colors.text_orange),
    },
    uploadImage: {
      paddingTop: hp(16),
      flexDirection: 'row',
    },
    addImage: {
      width: wp(110),
      height: wp(101),
      borderRadius: 20,
      borderColor: colors.border_line4,
      borderWidth: 1,
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addIcon: {
      width: wp(42),
      height: wp(42),
      resizeMode: 'cover',
    },
    addText: {
      ...commonFontStyle(400, 13, colors.dropDownText),
    },
    imageList: {
      flexGrow: 0,
    },
    itemPrice: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    priceInput: {
      marginTop: hp(40),
    },
    priceInputStyle: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border_line4,
      paddingHorizontal: wp(16),
    },
    dropDownStyle: {
      borderColor: colors.border_line4,
      // width: wp(137),
      height: hp(55),
    },
    imageContainer: {
      marginHorizontal: 10,
    },
    imageView: {
      width: wp(110),
      height: wp(101),
      borderRadius: 20,
      backgroundColor: colors.image_Bg_gray,
    },
    basicText: {
      ...commonFontStyle(500, 14, colors.black),
      paddingTop: hp(16),
    },
    basicInput: {
      height: hp(136),
      borderColor: colors.border_line4,
      borderWidth: 1,
      borderRadius: 8,
      padding: 15,
      textAlignVertical: 'top',
      marginTop: hp(8),
      color: colors.black,
    },
    spacerView: {
      height: isIos ? hp(210) : hp(110),
    },
    boxStyle: {
      borderWidth: 1,
      height: wp(150),
      width: wp(200),
      borderRadius: 18,
      marginBottom: 25,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.card_bg,
    },
    boxText: {
      ...commonFontStyle(400, 18, colors.black),
    },
    imageStyle: {
      height: wp(30),
      width: wp(30),
      marginBottom: 12,
    },
    miscellaneousText: {
      ...commonFontStyle(500, 14, colors.black),
      paddingTop: hp(20),
    },
    radioView: {
      flexDirection: 'row',
      marginTop:hp(12)
    },
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    radioButton: {
      height: 18,
      width: 18,
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
      height: 9,
      width: 9,
      borderRadius: 5,
      backgroundColor: colors.Primary_Orange,
    },
    radioText: {
      marginLeft: 8,
      ...commonFontStyle(400, 14, colors.Title_Text),
    },
    checkbox: {
      height: hp(22),
      width: wp(22),
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.text_border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedCheckbox: {
      // borderColor: colors.black,
      backgroundColor: colors.blue,
    },
    checkboxInner: {
      width: 10,
      height: 10,
      backgroundColor: colors.white,
    },
    checkIcon: {
      width: wp(18),
      height: hp(18),
      resizeMode: 'contain',
      tintColor: colors.black,
    },
    textStyle: {
      ...commonFontStyle(500, 14, colors.black),
      marginTop: hp(16),
      marginBottom: hp(8),
    },
    PercentageInput: {
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      height: hp(56),
      borderRadius: 32,
      borderColor: colors.border_line4,
      paddingHorizontal: 20,
    },
    inputTaxPercentage: {
      ...commonFontStyle(400, 14, colors.black),
      flex: 1,
    },
    pertenge: {
      width: 20,
      height: 20,
    },
    ic_check: {
      width: 12,
      height: 12,
    },
    text1: {
      ...commonFontStyle(500, 14, colors.title_dec),
    },

    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // paddingHorizontal: wp(20),
      paddingTop: hp(25),
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
  });
};
