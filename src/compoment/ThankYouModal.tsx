import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { commonFontStyle, hp, SCREEN_WIDTH, wp } from '../theme/fonts';
import CCModal from './CCModal';
import PrimaryButton from './PrimaryButton';
import { Icons } from '../utils/images';
import { strings } from '../i18n/i18n';
import Spacer from './Spacer';
import Input from './Input';
type Props = {
    visible?: boolean;
    closeModal: () => void;
    onPressGoToHome: () => void;
    title?: string;
    leftText: string;
    rightText: string;
    title1: strings
};

const ThankYouModal = ({ visible, closeModal, title, title1, onPressGoToHome, rightText }: Props) => {
    const { colors, isDark } = useTheme();
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors])

    return (
        <View>
            <CCModal
                visible={visible}
                close={closeModal}
                containStyle={{
                    alignItems: 'center',
                    paddingVertical: hp(16),
                    backgroundColor: colors.cards_bg
                }}
                contain={
                    <View>
                        <View style={styles.logoIcon}>
                            <Image source={Icons.thankIcon} style={styles.logoutIcon} />
                            <Text style={styles.logoutText}>
                                {title1}
                            </Text>
                        </View>

                        <Text style={styles.containerContain}>
                            {title}
                        </Text>
                        <View style={styles.underLine} />
                        <View style={styles.btnContainer}>
                            <PrimaryButton
                                extraStyle={styles.accpetBtn}
                                title={rightText}
                                titleStyle={styles.accpetText}
                                onPress={onPressGoToHome}
                            />
                        </View>
                    </View>
                }
            />
        </View>
    );
};

export default ThankYouModal;

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
        accpetBtn: {
            width: SCREEN_WIDTH * 0.80,
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
        },
    });
};
