import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {strings} from '../../i18n/i18n';
import HomeHeader from '../../compoment/HomeHeader';
import Input from '../../compoment/Input';
import PrimaryButton from '../../compoment/PrimaryButton';
import Spacer from '../../compoment/Spacer';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import {Icons} from '../../utils/images';
import {errorToast, infoToast} from '../../utils/commonFunction';
import {getAsyncUserInfo} from '../../utils/asyncStorageManager';
import {addMiscellaneousAction} from '../../actions/cuisinesAction';

const AddMiscellaneous = () => {
  const {colors} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const navigation = useNavigation();
  const [recipesName, setRecipesName] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [itemsList, setItemsList] = useState([]);
  const {isDarkTheme} = useAppSelector(state => state.common);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const onPressAddItem = () => {
    if (recipesName === '' || materialName === '') {
      errorToast(strings('miscellaneousList.error_empty_fields'));
      return;
    }
    const newItem = {
      id: Math.random().toString(),
      recipesName,
      materialName,
    };

    setItemsList([newItem, ...itemsList]);
    setRecipesName('');
    setMaterialName('');
  };

  const goback = () => {
    navigation.goBack();
  };

  const onPressNewAdd = async () => {
    if (recipesName == '') {
      infoToast(strings('miscellaneousList.miscellaneous_items_error'));
    } else if (materialName.trim() == '') {
      infoToast(strings('miscellaneousList.price_error'));
    } else {
      setLoading(true);
      let data = new FormData();
      data.append('name', recipesName);
      data.append('price', materialName);

      let obj = {
        data,
        onSuccess: (response: any) => {
          navigation.goBack();
          setRecipesName('');
          setMaterialName('');
          setLoading(false);
        },
        onFailure: (Err: any) => {
          if (Err != undefined) {
            Alert.alert('Warning', Err?.message);
          }
          setLoading(false);
        },
      };
      dispatch(addMiscellaneousAction(obj));
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
        title={strings('miscellaneousList.add_miscellaneous')}
        extraStyle={styles.headerContainer}
        isShowIcon={false}
      />
      <View style={styles.contentContainer}>
        <Input
          value={recipesName}
          placeholder={strings('miscellaneousList.e_miscellaneous_items')}
          label={strings('miscellaneousList.miscellaneous_items')}
          onChangeText={setRecipesName}
          isShowLabel={true}
        />
        <Input
          value={materialName}
          keyboardType="number-pad"
          placeholder={strings('miscellaneousList.add_price')}
          label={strings('miscellaneousList.price')}
          onChangeText={setMaterialName}
          isShowLabel={true}
        />
        {/* <TouchableOpacity style={styles.addBtnView} onPress={onPressAddItem}>
          <Image source={Icons.plus} style={styles.plusIcon} />
        </TouchableOpacity> */}

        {/* <FlatList
          data={itemsList}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{gap: 16}}
          renderItem={({item}) => (
            <View style={styles.cardContainer}>
              <View style={styles.boxView}>
                <Text style={styles.textStyle}>
                  {strings('miscellaneousList.miscellaneous_item_name')}
                </Text>
                <Text style={styles.nameText}>{item.recipesName}</Text>
              </View>
              <View style={[styles.boxView, {marginTop: hp(8)}]}>
                <Text style={styles.textStyle}>
                  {strings('miscellaneousList.price')}
                </Text>
                <Text
                  style={[
                    styles.nameText,
                    {color: colors.text_orange},
                  ]}>{`₹${item.materialName}`}</Text>
              </View>
            </View>
          )}
        /> */}

        <Spacer height={10} />
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          extraStyle={styles.submitButton}
          title={strings('CuisinesNameList.submit')}
          titleStyle={styles.submitText}
          onPress={onPressNewAdd}
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

export default AddMiscellaneous;

const getGlobalStyles = props => {
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
    cardContainer: {
      backgroundColor: colors.cards_bg,
      padding: 16,
      borderRadius: 16,
    },
    boxView: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    textStyle: {
      ...commonFontStyle(500, 14, colors.title_dec100),
    },
    nameText: {
      ...commonFontStyle(600, 14, colors.black),
    },
  });
};
