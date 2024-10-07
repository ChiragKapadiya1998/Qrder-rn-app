import { Keyboard, StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { wp, hp, commonFontStyle } from '../../theme/fonts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    errorToast,
    numberCheck,
    specialCarCheck,
    UpperCaseCheck,
} from '../../utils/commonFunction';
import PrimaryButton from '../../compoment/PrimaryButton';
import LoginHeader from '../../compoment/LoginHeader';
import { strings } from '../../i18n/i18n';
import { useAppDispatch } from '../../redux/hooks';
import Input from '../../compoment/Input';
import { screenName } from '../../navigation/screenNames';
import { changePasswords, updatePassword } from '../../actions/authAction';
import { getAsyncRole } from '../../utils/asyncStorageManager';
import HomeHeader from '../../compoment/HomeHeader';
import Spacer from '../../compoment/Spacer';

type Props = {};

const ChangePassword = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    const [currentPassword, setCurrentPassword] = useState < string > ('');
    const [password, setPassword] = useState < string > ('');
    const [confirmPassword, setConfirmPassword] = useState < string > ('');
    const [loading, setLoading] = useState < boolean > (false);
    const [isShowCurrent, setIsShowCurrent] = useState < boolean > (true);
    const [isShowPassword, setIsShowPassword] = useState < boolean > (true);
    const [isShowConfirmPassword, setIsShowConfirmPassword] =
        useState < boolean > (true);

    const passwordRef = useRef < any > (null);

    const onPressBack = () => {
        navigation.goBack();
    };

    const onPressUpdate = () => {
        if (currentPassword.trim().length === 0) {
            errorToast(strings('login.error_current_password'));
        } else if (currentPassword.trim().length < 9) {
            errorToast(strings('login.error_v_password'));
        } else if (!numberCheck(currentPassword)) {
            errorToast(strings('login.error_number_password'));
        } else if (!specialCarCheck(currentPassword)) {
            errorToast(strings('login.error_character_password'));
        } else if (!UpperCaseCheck(currentPassword)) {
            errorToast(strings('login.error_uppercase_password'));
        } else if (password.trim().length === 0) {
            errorToast(strings('login.error_new_password'));
        } else if (password.trim().length < 9) {
            errorToast(strings('login.error_v_password'));
        } else if (confirmPassword.trim().length === 0) {
            errorToast(strings('login.error_v_confirm'));
        } else if (!numberCheck(password)) {
            errorToast(strings('login.error_number_password'));
        } else if (!specialCarCheck(password)) {
            errorToast(strings('login.error_character_password'));
        } else if (!UpperCaseCheck(password)) {
            errorToast(strings('login.error_uppercase_password'));
        } else if (confirmPassword.trim() !== password.trim()) {
            errorToast(strings('login.error_re_tyre_match'));
        } else {
            setLoading(true)
            var data = new FormData();
            data.append('current_password', currentPassword);
            data.append('password', password);
            data.append('password_confirmation', confirmPassword);

            let obj = {
                data,
                onSuccess: () => {
                    setLoading(false)
                    setCurrentPassword('')
                    setConfirmPassword('');
                    setPassword('');
                    onPressBack()
                },
                onFailure: (Err: any) => {
                    setLoading(false)
                    if (Err != undefined) {
                        errorToast(Err?.message);
                        setLoading(false)
                    }
                },
            };
            dispatch(changePasswords(obj));
        }
    };



    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={'light-content'}
                backgroundColor={colors.bg_white}
            />
            <HomeHeader
                onBackPress={() => {
                    onPressBack()
                }}
                onRightPress={() => {
                    console.log('dee');
                }}
                mainShow={true}
                title={strings('profileScreen.change_password')}
                extraStyle={styles.bottomContainer}
                isHideIcon={true}
            />
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainerStyle}>
                <Input
                    value={currentPassword}
                    returnKeyType="done"
                    isShowEyeIcon={true}
                    placeholder={strings('profileScreen.add_current_password')}
                    secureTextEntry={isShowCurrent}
                    label={strings('profileScreen.current_password')}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    onChangeText={(t: string) => setCurrentPassword(t.trim())}
                    onPressEye={() => setIsShowCurrent(!isShowCurrent)}
                    isShowLabel={true}
                />
                <Input
                    value={password}
                    returnKeyType="done"
                    isShowEyeIcon={true}
                    placeholder={strings('profileScreen.add_new_password')}
                    secureTextEntry={isShowPassword}
                    label={strings('Phone_number_verification.new_password')}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    onChangeText={(t: string) => setPassword(t.trim())}
                    onPressEye={() => setIsShowPassword(!isShowPassword)}
                    isShowLabel={true}
                />
                <Input
                    value={confirmPassword}
                    returnKeyType="done"
                    isShowEyeIcon={true}
                    inputRef={passwordRef}
                    placeholder={strings('profileScreen.add_confirm_password')}
                    secureTextEntry={isShowConfirmPassword}
                    label={strings('Phone_number_verification.confirm_password')}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    onChangeText={(t: string) => setConfirmPassword(t.trim())}
                    onPressEye={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                    isShowLabel={true}
                />
            </KeyboardAwareScrollView>
            <View style={styles.buttonContainer}>
                <PrimaryButton
                    extraStyle={styles.submitButton}
                    onPress={onPressUpdate}
                    title={strings('Phone_number_verification.update')}
                    titleStyle={styles.submitText}
                    isLoading={loading}
                />
                <Spacer width={16} />
                <PrimaryButton
                    extraStyle={styles.cancelBtn}
                    onPress={onPressBack}
                    title={strings('Phone_number_verification.reset')}
                    titleStyle={styles.cancelText}
                />
            </View>
        </View>
    );
};

export default ChangePassword;

const getGlobalStyles = (props: any) => {
    const { colors } = props;
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.bg_white,
        },
        bottomContainer: {
            backgroundColor: colors.bg_white,
            paddingBottom: hp(7)
        },
        contentContainerStyle: {
            paddingHorizontal: wp(20),
        },
        signupButton: {
            marginTop: hp(20),
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
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
