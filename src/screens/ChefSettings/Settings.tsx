import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import  { strings } from '../../i18n/i18n';
import { Dropdown } from 'react-native-element-dropdown';
import HomeHeader from '../../compoment/HomeHeader';
import { commonFontStyle, hp, SCREEN_WIDTH, wp } from '../../theme/fonts';
import DleleteModal from '../../compoment/DeleteModal';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setDarkTheme, setLanguage } from '../../utils/commonActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { asyncKeys } from '../../utils/asyncStorageManager';

const languages = [
    { label: 'English', value: 'en' },
    { label: 'Gujarati', value: 'gj' },
    { label: 'Hindi', value: 'hi' },
];

const Settings = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [visible, setVisible] = useState(false);
    const { isDarkTheme, isLanguage } = useAppSelector(state => state.common);


    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const storedLanguage = await AsyncStorage.getItem(asyncKeys.is_language);
                if (storedLanguage) {
                    setSelectedLanguage(storedLanguage)
                }
            } catch (error) {
                console.error('Failed to load language:', error);
            }
        };

        loadLanguage();
    }, [isLanguage]);

    const closeModal = () => {
        setVisible(false)
    }
    const onPressDelete = () => {
        setVisible(false)
    }

    const changeValue = () => {
        dispatch(setDarkTheme(!isDarkTheme));
    };

    const changeLanguage = async (lang: string) => {
        dispatch(setLanguage(lang));
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkTheme ? 'light-content' : 'dark-content'} backgroundColor={colors.white} />
            <HomeHeader
                onBackPress={() => navigation.goBack()}
                mainShow={true}
                title={strings('Settings.settings')}
                extraStyle={styles.headerContainer}
                isShowIcon={false}
            />
            <View style={styles.subContainer}>
                <View style={[styles.dropdownContainer]}>
                    <Text style={styles.label}>{strings('Settings.theme')}</Text>
                    <Switch
                        value={isDarkTheme}
                        onChange={() => changeValue()}
                        onMagicTap={changeValue}
                        thumbColor={isDarkTheme ? colors.image_bg : colors.input_bg1}
                        trackColor={{ false:  colors.text_gray1 , true: colors.input_bg1}}
                        style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }} 
                    />
                </View>
                <View style={[styles.dropdownContainer,, { marginTop: hp(20) }]}>
                    <Text style={styles.label}>{strings('Settings.language')}</Text>
                    <Dropdown
                        style={styles.dropdown}
                        selectedTextStyle={[styles.label, { marginLeft: 15,color:colors.text_orange,alignSelf:'center' }]}
                        data={languages}
                        labelField="label"
                        valueField="value"
                        placeholder=""
                        value={selectedLanguage}
                        onChange={(item) => changeLanguage(item.value)}
                        iconStyle={styles.downIcon}
                        containerStyle={{ backgroundColor: colors.cards_bg, top: 10 }}
                        activeColor={colors.border}
                        itemTextStyle={{ color: colors.black }}
                        iconStyle={{tintColor:colors.text_orange}}
                    />
                </View>
                <Text style={styles.titleLabel}>{strings('Settings.account_setting')}</Text>
                <TouchableOpacity style={[styles.dropdownContainer]} onPress={() => setVisible(true)}>
                    <Text style={styles.deleteText}>{strings('Settings.deactivate_account')}</Text>
                </TouchableOpacity>
            </View>
            <DleleteModal
                title={strings('Settings.deleteText')}
                rightText={strings('Settings.yes')}
                leftText={strings('Settings.no')}
                visible={visible} closeModal={() => closeModal()}
                onPressDelete={() => onPressDelete()}
            />
        </View>
    );
};

const getGlobalStyles = (props) => {
    const { colors } = props;
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.bg_white,
        },
        headerContainer: {
            backgroundColor: colors.bg_white,
        },
        subContainer: {
            marginHorizontal: wp(20),
        },
        titleLabel: {
            ...commonFontStyle(400, 15, colors.black),
            paddingTop: hp(12),
            marginBottom: hp(18)
        },
        dropdownContainer: {
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: wp(16),
            paddingVertical: hp(13),
            borderRadius: 8,
            flexDirection: 'row',
            backgroundColor: colors.cards_bg,
        },
        label: {
            ...commonFontStyle(500, 15, colors.black),
        },
        dropdown: {
            width: SCREEN_WIDTH * 0.25,
        },
        downIcon: {
            width: 22,
            height: 22,
            resizeMode: 'contain',
            tintColor: colors.black,
        },
        deleteText: {
            ...commonFontStyle(400, 15, colors.red_ED7C7C),
        },
    });
};

export default Settings;
