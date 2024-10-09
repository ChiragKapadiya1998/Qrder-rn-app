import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { commonFontStyle, hp, wp } from '../theme/fonts';
import CCModal from './CCModal';
type Props = {
    visible?: boolean;
    closeModal: () => void;
    title?: string;
};

const ReviewModal = ({
    visible,
    closeModal,
    title,
}: Props) => {
    const { colors, isDark } = useTheme();
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

    return (
        <View>
            <CCModal
                visible={visible}
                close={closeModal}
                containStyle={{
                    alignItems: 'flex-start', paddingHorizontal: wp(16),
                    paddingVertical: hp(20)
                }}
                contain={
                    <View>
                        <Text style={styles.containerContain}>{title}</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('https://g.co/kgs/8hUXnYs')}>
                            <Text style={styles.linkText}>{'https://g.co/kgs/8hUXnYs'}</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
};

export default ReviewModal;

const getGlobalStyles = (props: any) => {
    const { colors } = props;
    return StyleSheet.create({
        containerContain: {
            ...commonFontStyle(500, 14, colors.black),
        },
        linkText: {
            marginTop: hp(19),
            ...commonFontStyle(400, 14, colors.black),
        }
    });
};
