import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {errorToast, infoToast} from '../../utils/commonFunction';
import {strings} from '../../i18n/i18n';
import HomeHeader from '../../compoment/HomeHeader';
import Input from '../../compoment/Input';
import PrimaryButton from '../../compoment/PrimaryButton';
import Spacer from '../../compoment/Spacer';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {Icons} from '../../utils/images';
import {addRecipeMasterAction} from '../../actions/cuisinesAction';
import CCDropDown from '../../compoment/CCDropDown';

const options = [
  {name: strings('recipesMaster.kg'), value: 'kg'},
  {name: strings('recipesMaster.pcs'), value: 'pcs'},
  {name: strings('recipesMaster.ltr'), value: 'ltr'},
];

const AddRecipesMasters = () => {
  const {colors} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const navigation = useNavigation();
  const [recipesname, setRecipesname] = useState('');
  const {getMenuMasters, getRecipesMenu} = useAppSelector(state => state.data);
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  const [recipesList, setRecipesList] = useState([
    {recipesName: '', materialName: '', stockName: '', unitName: ''},
  ]);
  const [loading, setLoading] = useState(false);
  const {isDarkTheme} = useAppSelector(state => state.common);
  const dispatch = useAppDispatch();

  const goback = () => {
    navigation.goBack();
  };

  useEffect(() => {
    // Listeners for keyboard events
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardStatus(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardStatus(false);
      },
    );

    // Cleanup event listeners
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const onPressAdd = () => {
    setRecipesList([
      ...recipesList,
      {recipesName: '', materialName: '', stockName: '', unitName: ''},
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const newList = [...recipesList];
    newList[index][field] = value;
    setRecipesList(newList);
  };

  console.log(
    'adasds',
    recipesList.map(item => {
      return {
        item_id: item?.materialName,
        weight: item?.stockName,
        unit: item?.unitName,
      };
    }),
  );

  const onPressEdit = async () => {
    if (recipesname == '') {
      errorToast(strings('recipesMaster.recipesMaster_error'));
    } else {
      setLoading(true);
      let obj = {
        data: {
          menu_id: recipesname,
          items: recipesList.map(item => {
            return {
              item_id: item?.materialName,
              weight: item?.stockName,
              unit: item?.unitName,
            };
          }),
        },
        onSuccess: (response: any) => {
          navigation.goBack();

          setLoading(false);
        },
        onFailure: (Err: any) => {
          if (Err != undefined) {
            Alert.alert('Warning', Err?.message);
          }
          setLoading(false);
        },
      };
      dispatch(addRecipeMasterAction(obj));
    }
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
        title={strings('profileScreen.recipes_master')}
        extraStyle={styles.headerContainer}
        isShowIcon={false}
      />
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View>
          <CCDropDown
            data={getRecipesMenu?.map(item => {
              return {name: item?.name, value: item?.id};
            })}
            labelField={'name'}
            valueField={'value'}
            placeholder={strings('recipesMaster.e_recipes_name')}
            label={strings('recipesMaster.recipes_Name')}
            DropDownStyle={styles.dropDownStyle}
            value={recipesname}
            isShowLabel={true}
            setValue={item => {
              setRecipesname(item);
            }}
            extraStyle={styles.extraDropStyle}
          />
          {recipesList.map((recipe, index) => (
            <View key={index}>
              <CCDropDown
                data={getMenuMasters.map(item => {
                  return {name: item?.material_name, value: item?.id};
                })}
                labelField={'name'}
                valueField={'value'}
                placeholder={strings('recipesMaster.e_material_name')}
                label={strings('recipesMaster.material_name')}
                DropDownStyle={styles.dropDownStyle}
                value={recipe.materialName}
                isShowLabel={true}
                setValue={item => {
                  handleInputChange(index, 'materialName', item);
                }}
                extraStyle={styles.extraDropStyle}
              />
              <Input
                value={recipe.stockName}
                placeholder={strings('recipesMaster.e_stock')}
                label={strings('recipesMaster.stock')}
                onChangeText={t => handleInputChange(index, 'stockName', t)}
                isShowLabel={true}
                keyboardType="number-pad"
              />

              <CCDropDown
                data={options}
                placeholder={strings('recipesMaster.e_unit')}
                labelField={'name'}
                valueField={'value'}
                label={strings('recipesMaster.unit')}
                DropDownStyle={styles.dropDownStyle}
                value={recipe.unitName}
                isShowLabel={true}
                setValue={item => {
                  handleInputChange(index, 'unitName', item);
                }}
                extraStyle={styles.extraDropStyle}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.addBtnView} onPress={onPressAdd}>
            <Image source={Icons.plus} style={styles.plusIcon} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {!keyboardStatus && (
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
      )}
    </View>
  );
};
export default AddRecipesMasters;

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg_white,
    },
    headerContainer: {
      paddingBottom: hp(4),
    },
    contentContainer: {
      flex: 1,
      marginHorizontal: wp(20),
    },
    addBtnView: {
      height: hp(52),
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.bg_white,
      borderColor: colors.image_bg,
      borderWidth: 1,
      marginTop: hp(24),
      marginBottom: hp(24),
    },
    plusIcon: {
      width: 14,
      height: 14,
      resizeMode: 'contain',
      tintColor: colors.black,
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
  });
};
