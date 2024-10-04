import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useTheme } from '@react-navigation/native';
import HomeHeader from '../../compoment/HomeHeader';
import { strings } from '../../i18n/i18n';
import { useAppSelector } from '../../redux/hooks';


const TermCondition = () => {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation();
    const { isDarkTheme } = useAppSelector(state => state.common);
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
                backgroundColor={colors.white}
            />
            <HomeHeader
                onBackPress={() => {
                    navigation.goBack();
                }}
                onRightPress={() => {
                    console.log('dee');
                }}
                mainShow={true}
                title={strings('profileScreen.term_condition')}
                extraStyle={styles.headerContainer}
                isHideIcon={true}
            />
        </View>
    );
};

export default TermCondition;

const getGlobalStyles = (props: any) => {
    const { colors } = props;
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.bg_white,
        },
        headerContainer: {
            backgroundColor: colors.bg_white,
        },
    });
};
