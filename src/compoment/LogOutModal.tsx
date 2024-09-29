import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { commonFontStyle, hp, SCREEN_WIDTH, wp } from '../theme/fonts';
import CCModal from './CCModal';
import PrimaryButton from './PrimaryButton';
import { Icons } from '../utils/images';
import { strings } from '../i18n/i18n';
import Spacer from './Spacer';
type Props = {
    visible?: boolean;
    closeModal: () => void;
    onPressDelete: () => void;
    title?: string;
    leftText: string;
    rightText: string
};

const LogOutModal = ({ visible, closeModal, title, onPressDelete, leftText, rightText }: Props) => {
    const { colors, isDark } = useTheme();
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

    return (
        <View>
            <CCModal
                visible={visible}
                close={closeModal}
                containStyle={{
                    alignItems: 'center',
                    paddingVertical: hp(16),
                }}
                contain={
                    <View>
                        <View style={styles.logoIcon}>
                            <Image source={Icons.logotLogo} style={styles.logoutIcon} />
                            <Text style={styles.logoutText}>
                                {strings('profileScreen.log_out')}
                            </Text>
                        </View>

                        <Text style={styles.containerContain}>
                            {title}
                        </Text>
                        <View style={styles.underLine} />
                        <View style={styles.btnContainer}>
                            <PrimaryButton
                                extraStyle={styles.cancelBtn}
                                title={leftText}
                                titleStyle={styles.cancelText}
                                onPress={closeModal}
                            />
                            <Spacer width={16} />
                            <PrimaryButton
                                extraStyle={styles.accpetBtn}
                                title={rightText}
                                titleStyle={styles.accpetText}
                                onPress={onPressDelete}
                            />
                        </View>
                    </View>
                }
            />
        </View>
    );
};

export default LogOutModal;

const getGlobalStyles = (props: any) => {
    const { colors } = props;
    return StyleSheet.create({
        containerContain: {
            alignSelf: 'center',
            marginTop: hp(8),
            ...commonFontStyle(400, 14, colors.text_gray),
        },
        logoIcon: {
            alignItems: 'center',
            paddingTop: hp(16)
        },
        btnContainer: {
            flexDirection: 'row'
        },
        logoutIcon: {
            width: wp(60),
            height: hp(60),
            resizeMode: 'contain',
        },
        logoutText: {
            marginTop: hp(10),
            ...commonFontStyle(700, 18, colors.black),
        },
        cancelBtn: {
            width: SCREEN_WIDTH * 0.39,
            height: hp(50),
            backgroundColor: colors.cards_bg,
            borderColor: colors.text_orange,
            borderWidth: 1,
            borderRadius: 50,
        },
        cancelText: {
            ...commonFontStyle(600, 16, colors?.text_orange),
            textTransform: 'none',
        },
        accpetBtn: {
            width: SCREEN_WIDTH * 0.39,
            height: hp(50),
            backgroundColor: colors.text_orange,
            borderColor: colors.text_orange,
            borderWidth: 1,
            borderRadius: 50,
        },
        accpetText: {
            ...commonFontStyle(600, 16, colors?.defult_white),
            textTransform: 'none',
        },
        underLine: {
            marginTop: hp(24),
            marginBottom: hp(16),
            height: 1,
            backgroundColor: colors.border
        }
    });
};
