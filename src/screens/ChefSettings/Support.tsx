import { Alert, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native'
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import HomeHeader from '../../compoment/HomeHeader';
import { strings } from '../../i18n/i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Input from '../../compoment/Input';
import PrimaryButton from '../../compoment/PrimaryButton';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import CCDropDown from '../../compoment/CCDropDown';

type Props = {};

const Support = (props: Props) => {
    const route = useRoute();
    const { colors, isDark } = useTheme();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    const { isDarkTheme } = useAppSelector(state => state.common);
    const [names, setName] = useState < string > ('');
    const [description, setDescription] = useState < string > ('');
    const [lastName, setLastName] = useState('');
    const { getCuisines } = useAppSelector(state => state.data);


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
                        data={getCuisines}
                        label={strings('supportText.type_support')}
                        labelField={'name'}
                        valueField={'id'}
                        placeholder={strings('supportText.p_support')}
                        DropDownStyle={styles.dropDownStyle}
                        value={names}
                        setValue={setName}
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
                    onPress={() => { }}
                    title={strings('PersonalInfo.save_details')}
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
