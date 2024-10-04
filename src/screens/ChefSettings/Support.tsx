import { Alert, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native'
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import HomeHeader from '../../compoment/HomeHeader';
import { strings } from '../../i18n/i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Input from '../../compoment/Input';
import PrimaryButton from '../../compoment/PrimaryButton';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import CCDropDown from '../../compoment/CCDropDown';
import { addSupportDetails, getSupportAction } from '../../actions/commonAction';
import { errorToast } from '../../utils/commonFunction';
import { getAsyncUserInfo } from '../../utils/asyncStorageManager';

type Props = {};

const Support = (props: Props) => {
    const route = useRoute();
    const { colors, isDark } = useTheme();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    const { isDarkTheme, getSupport } = useAppSelector(state => state.common);
    const [supportType, setSupportType] = useState < string > ('');
    const [description, setDescription] = useState < string > ('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getSupportType()
    }, [])

    const getSupportType = () => {
        let obj = {
            onSuccess: (res: any) => { },
            onFailure: (Err: any) => { },
        };
        dispatch(getSupportAction(obj));
    }


    const onPressSupport = async () => {
        if (supportType.trim().length === 0) {
            errorToast(strings('supportText.e_type_support'));
        } else if (description.trim().length === 0) {
            errorToast(strings('supportText.e_enter_text'));
        } else {
            setLoading(true)
            const userDetails = await getAsyncUserInfo()

            let data = new FormData();

            data.append('user_id', userDetails.id);
            data.append('support_type', supportType);
            data.append('description', description);

            let userInfo = {
                data,
                onSuccess: (res) => {
                    setSupportType('');
                    setDescription('');
                    setLoading(false)
                    navigation.goBack()
                },
                onFailure: (Err: any) => {
                    if (Err !== undefined) {
                        setLoading(false)
                        errorToast(Err?.data?.message);
                    }
                    setLoading(false)
                },
            };
            dispatch(addSupportDetails(userInfo));
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkTheme ? 'light-content' : 'dark-content'} backgroundColor={colors.white} />
            <HomeHeader
                onBackPress={() => {
                    navigation.goBack();
                }}
                mainShow={true}
                title={strings('supportText.support')}
                isShowIcon={false}
                extraStyle={styles.headerContainer}
                isHideIcon={true}
                rightTextStyle={styles.rightTextStyle}
            />
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'handled'}>
                <View style={styles.subContainer}>
                    <CCDropDown
                        data={getSupport}
                        label={strings('supportText.type_support')}
                        labelField={'name'}
                        valueField={'name'}
                        placeholder={strings('supportText.p_support')}
                        DropDownStyle={styles.dropDownStyle}
                        value={supportType}
                        setValue={setSupportType}
                        extraStyle={styles.otherStyle}
                        isShowLabel={true}
                    />

                    <Text style={styles.basicText}>
                        {strings('supportText.text')}
                    </Text>
                    <TextInput
                        value={description}
                        onChangeText={(t: string) => setDescription(t)}
                        placeholder={strings('supportText.enter_text')}
                        style={[styles.basicInput, {
                            borderColor:
                                description?.length == 0 ? colors.border : colors.text_orange,
                        },]}
                        multiline
                        maxLength={200}
                        placeholderTextColor={colors.text_gray}
                    />
                </View>
            </KeyboardAwareScrollView>

            <View style={{ bottom: 8, paddingHorizontal: wp(20) }}>
                <PrimaryButton
                    extraStyle={styles.signupButton}
                    onPress={() => onPressSupport()}
                    title={strings('PersonalInfo.save_details')}
                    isLoading={loading}
                />
            </View>
        </View >
    );
};

export default Support;

const getGlobalStyles = (props: any) => {
    const { colors } = props;
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.white,
        },
        headerContainer: {
            backgroundColor: colors.white,
        },
        rightTextStyle: {
            textDecorationLine: 'underline',
            textTransform: 'uppercase'
        },
        subContainer: {
            paddingHorizontal: wp(20)
        },
        signupButton: {
            marginTop: hp(20),
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
        basicText: {
            marginTop: hp(20),
            ...commonFontStyle(500, 14, colors.black),
        },
        basicInput: {
            height: hp(88),
            borderRadius: 16,
            padding: 16,
            textAlignVertical: 'top',
            marginTop: hp(8),
            color: colors.black,
            borderColor: colors.border,
            borderWidth: 1,
            backgroundColor: colors.white
        },
    });
};
