import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useTheme } from '@react-navigation/native';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import PrimaryButton from '../../compoment/PrimaryButton';
import { screenName } from '../../navigation/screenNames';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoginHeader from '../../compoment/LoginHeader';
import { strings } from '../../i18n/i18n';
import CCDropDown from '../../compoment/CCDropDown';
import { DropDownData, DropDownDatas, errorToast } from '../../utils/commonFunction';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUniversitiesDataAction, getUniversityDataAction, selectRoleAction } from '../../actions/commonAction';

type Props = {};

const StudentSelect = (props: Props) => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const [selectUniversity, setSelectUniversity] = useState('');
  const { getUniversitiesData } = useAppSelector(state => state.data);

  const onPressSelect = () => {
    if (selectUniversity == '') {
      errorToast(strings('StudentSignUp.error_university'));
    } else {
      let obj = {
        params: selectUniversity,
        onSuccess: (res: any) => {
          navigation.navigate(screenName.StudentBottomBar)
        },
        onFailure: (Err: any) => { },
      };
      dispatch(getUniversityDataAction(obj));
    }

  };


  useEffect(() => {
    getUniversitiesDataPress()
  }, []);

  const getUniversitiesDataPress = () => {
    let obj = {
      onSuccess: (res: any) => { },
      onFailure: (Err: any) => { },
    };
    dispatch(getUniversitiesDataAction(obj));
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={colors.Primary_Bg}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={styles.contentContainerStyle}>
          <Text style={styles.selectText}>{strings('StudentSignUp.select_university')}</Text>
          <Text style={styles.desText}>{strings('sign_up.sign_dec')}</Text>
        <CCDropDown
          data={getUniversitiesData}
          label={strings('StudentSignUp.university_name')}
          labelField={'name'}
          valueField={'id'}
          placeholder={strings('StudentSignUp.select_university_name')}
          DropDownStyle={styles.dropDownStyle}
          value={selectUniversity}
          setValue={setSelectUniversity}
          extraStyle={styles.otherStyle}
        />

        <PrimaryButton
          extraStyle={styles.signupButton}
          onPress={onPressSelect}
          title={strings('roleSelection.continue')}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default StudentSelect;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg_white,

    },
    contentContainerStyle: {
      flex: 1,
      paddingHorizontal: wp(20),
      justifyContent: 'center'
    },
    dropDownStyle: {
      borderColor: colors.input_border,
      backgroundColor: colors.input_bg,
      height: hp(56),
      borderRadius: 32,
      paddingHorizontal: wp(25),
      marginTop: hp(20),
    },
    selectText:{
      ...commonFontStyle(800, 20, colors.black),
      textAlign:'center'
    },
    desText:{
      ...commonFontStyle(400, 14, colors.text_gray),
      textAlign:'center'
    },
    otherStyle: {
      marginTop: hp(8),
    },
    signupButton: {
      marginTop: hp(12),
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
