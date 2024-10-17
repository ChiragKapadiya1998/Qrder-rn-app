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
import {errorToast, infoToast} from '../../utils/commonFunction';
import {strings} from '../../i18n/i18n';
import {getAsyncUserInfo} from '../../utils/asyncStorageManager';
import HomeHeader from '../../compoment/HomeHeader';
import Input from '../../compoment/Input';
import PrimaryButton from '../../compoment/PrimaryButton';
import Spacer from '../../compoment/Spacer';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import CCDropDown from '../../compoment/CCDropDown';
import {addMenuMastersAction} from '../../actions/cuisinesAction';

const options = [
  {name: strings('recipesMaster.kg'), value: 'kg'},
  {name: strings('recipesMaster.pcs'), value: 'pcs'},
  {name: strings('recipesMaster.ltr'), value: 'ltr'},
];

const AddItemMasters = () => {
  const {colors} = useTheme();
  // const route = useRoute();
  // const { selectList } = route?.params;
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const navigation = useNavigation();
  const [unitName, setUnitName] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [inWeightNmae, setInWeightNmae] = useState('');
  const [loading, setLoading] = useState(false);
  const {isDarkTheme} = useAppSelector(state => state.common);
  const dispatch = useAppDispatch();

  const onPressEdit = async () => {
    if (materialName == '') {
      errorToast(strings('itemMastersList.add_item_masters_error'));
    } else if (inWeightNmae == '') {
      errorToast(strings('itemMastersList.weight_error'));
    } else if (unitName == '') {
      errorToast(strings('itemMastersList.select_unit_error'));
    } else {
      setLoading(true);
      let obj = {
        data: {
          material_name: materialName,
          stock: inWeightNmae,
          unit: unitName,
        },
        onSuccess: (response: any) => {
          navigation.goBack();
          setUnitName('');
          setMaterialName('');
          setInWeightNmae('');
          setLoading(false);
        },
        onFailure: (Err: any) => {
          if (Err != undefined) {
            Alert.alert('Warning', Err?.message);
          }
          setLoading(false);
        },
      };
      dispatch(addMenuMastersAction(obj));
    }
  };

  const goback = () => {
    navigation.goBack();
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
        title={strings('itemMastersList.item_masters')}
        extraStyle={styles.headerContainer}
        isShowIcon={false}
      />
      <View style={styles.contentContainer}>
        <Input
          value={materialName}
          placeholder={strings('itemMastersList.add_material_name')}
          label={strings('recipesMaster.material_name')}
          onChangeText={(t: string) => setMaterialName(t)}
          isShowLabel={true}
        />
        <Input
          value={inWeightNmae}
          placeholder={strings('recipesMaster.e_unit')}
          label={strings('itemMastersList.in_weight')}
          placeholder={strings('itemMastersList.e_weight')}
          onChangeText={(t: string) => setInWeightNmae(t.trim())}
          isShowLabel={true}
          keyboardType="number-pad"
        />
        <CCDropDown
          data={options}
          placeholder={strings('itemMastersList.add_unit')}
          labelField={'name'}
          valueField={'value'}
          label={strings('recipesMaster.unit')}
          DropDownStyle={styles.dropDownStyle}
          value={unitName}
          isShowLabel={true}
          setValue={item => {
            setUnitName(item);
          }}
          extraStyle={styles.extraDropStyle}
        />
        {/* <Input
                    value={inWeightNmae}
                    placeholder={strings('itemMastersList.e_weight')}
                    label={strings('itemMastersList.in_weight')}
                    onChangeText={(t: string) => setInWeightNmae(t)}
                   
                    isShowLabel={true}
                /> */}
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
export default AddItemMasters;

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
    dropDownStyle: {
      borderColor: colors.input_border,
      backgroundColor: colors.input_bg,
      height: hp(56),
      borderRadius: 32,
      paddingHorizontal: wp(25),
      marginTop: 0,
    },
    extraDropStyle: {
      marginTop: hp(12),
    },
  });
};
