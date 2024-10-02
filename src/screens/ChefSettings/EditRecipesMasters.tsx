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
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {infoToast} from '../../utils/commonFunction';
import {strings} from '../../i18n/i18n';
import {getAsyncUserInfo} from '../../utils/asyncStorageManager';
import HomeHeader from '../../compoment/HomeHeader';
import Input from '../../compoment/Input';
import PrimaryButton from '../../compoment/PrimaryButton';
import Spacer from '../../compoment/Spacer';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import CCDropDown from '../../compoment/CCDropDown';
import {editRecipeMastersAction} from '../../actions/cuisinesAction';

const EditRecipesMasters = () => {
  const {colors} = useTheme();
  const route = useRoute();
  const {data} = route?.params;
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const navigation = useNavigation();
  const [recipesName, setRecipesName] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [stockName, setStockName] = useState('');
  const [unitName, setUnitName] = useState('');
  const [loading, setLoading] = useState(false);
  const {isDarkTheme} = useAppSelector(state => state.common);
  const dispatch = useAppDispatch();
  const [recipesname, setRecipesname] = useState(data?.id);
  const {getMenuMasters, getRecipesMenu} = useAppSelector(state => state.data);
  const [recipesList, setRecipesList] = useState(data?.items);
  console.log('recipesList', data);

  const onPressEdit = async () => {
    setLoading(true);
    let obj = {
      data: {
        menu_id: data?.id,
        items: recipesList.map(item => {
          return {
            item_id: item?.item_id,
            weight: item?.weight,
            unit: item?.unit,
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
    console.log('datadatadatadata', obj?.data);

    dispatch(editRecipeMastersAction(obj));
  };

  const goback = () => {
    navigation.goBack();
  };

  const handleInputChange = (index, field, value) => {
    const newList = [...recipesList];
    newList[index][field] = value;
    setRecipesList(newList);
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
      <View style={styles.contentContainer}>
        {/* <CCDropDown
          data={getRecipesMenu.map(item => {
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
        /> */}
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
              value={recipe.item_id}
              isShowLabel={true}
              disable={true}
              setValue={item => {
                handleInputChange(index, 'item_id', item);
              }}
              extraStyle={styles.extraDropStyle}
            />
            <Input
              value={recipe.unit}
              placeholder={strings('recipesMaster.e_stock')}
              label={strings('recipesMaster.stock')}
              onChangeText={t => handleInputChange(index, 'unit', t)}
              isShowLabel={true}
            />
            <Input
              value={recipe.weight}
              placeholder={strings('recipesMaster.e_unit')}
              label={strings('recipesMaster.unit')}
              onChangeText={t => handleInputChange(index, 'weight', t)}
              isShowLabel={true}
            />
          </View>
        ))}
      </View>

      {/* <View style={styles.buttonContainer}>
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
      </View> */}
    </View>
  );
};
export default EditRecipesMasters;

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
