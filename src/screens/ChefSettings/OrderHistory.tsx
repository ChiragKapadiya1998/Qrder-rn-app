import React, { useState } from 'react';
import {
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useNavigation, useTheme } from '@react-navigation/native';
import { strings } from '../../i18n/i18n';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { useAppSelector } from '../../redux/hooks';
import HomeHeader from '../../compoment/HomeHeader';
import { Icons } from '../../utils/images';
import HomeDropDown from '../../compoment/HomeDropDown';

const OrderHistory = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    const [selectedChefs, setSelectedChefs] = useState('');
    const { isDarkTheme } = useAppSelector(state => state.common);
    const [dropDownValue, setdropDownValue] = useState(strings('home.daily'));

    const onCancelBtn = () => {};

    const data = [1, 2, 3, 4, 5, 6];

    const renderItem = ({ item, index }) => (
        <View style={styles.listContainer}>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.imageView}>
                    <Text style={styles.imageText}>#{index + 1}</Text>
                </View>

                <View style={styles.rightContainer}>
                    <Text style={styles.breakText}>Invoice ID: #32053</Text>
                    <Text style={styles.titleStyle}>Kartik Patel</Text>
                    <Text style={styles.idText}>Table No: 32</Text>
                    <View style={styles.priceView}>
                        <Text style={styles.priceText}>₹60</Text>
                        <Text style={styles.dateText}>18 January 2024</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.diningView}>
                    <Text style={styles.diningText}>Dining</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.btnContainer}>
                <TouchableOpacity onPress={onCancelBtn} style={styles.cancelBtn}>
                    <Image style={styles.invoiveIcon} source={Icons.invoiceIcon} />
                    <Text style={styles.cancelText}>{strings('profileScreen.download_invoice')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkTheme ? 'light-content' : 'dark-content'} backgroundColor={colors.white} />
            <HomeHeader
                onBackPress={() => navigation.goBack()}
                mainShow={true}
                title={strings('profileScreen.order_history')}
                isShowIcon={false}
                extraStyle={styles.headerContainer}
                isHideIcon={true}
                rightTextStyle={styles.rightTextStyle}
            />
            <View style={styles.headerView}>
                <HomeDropDown
                    value={dropDownValue}
                    onChangeText={(text) => setdropDownValue(text)}
                    isShowDate={true}
                />
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: hp(160) }} 
                />
            </View>
        </View>
    );
};

const getGlobalStyles = (props: any) => {
    const { colors } = props;

    return StyleSheet.create({
        container: {
            backgroundColor: colors.bg_white,
        },
        headerContainer: {
            backgroundColor: colors.white,
            paddingBottom: hp(0),
        },
        rightTextStyle: {
            textDecorationLine: 'underline',
            textTransform: 'uppercase',
        },
        headerView: {
            paddingHorizontal: wp(20),
        },
        listContainer: {
            marginTop: hp(8),
            backgroundColor: colors.cards_bg,
            paddingVertical: hp(16),
            paddingHorizontal: wp(16),
            borderRadius: 16,
        },
        imageView: {
            width: wp(70),
            height: hp(70),
            borderRadius: 16,
            backgroundColor: colors.image_bg,
            justifyContent: 'center',
            alignItems: 'center',
        },
        imageText: {
            ...commonFontStyle(700, 24, colors.black),
        },
        rightContainer: {
            marginLeft: wp(10),
            flex: 1,
        },
        breakText: {
            ...commonFontStyle(400, 10, colors.text_orange),
        },
        titleStyle: {
            ...commonFontStyle(600, 14, colors.black),
        },
        idText: {
            marginTop: hp(2),
            ...commonFontStyle(400, 12, colors.title_dec),
        },
        priceView: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        priceText: {
            ...commonFontStyle(600, 16, colors.text_orange),
        },
        dateText: {
            ...commonFontStyle(500, 14, colors.text_gray),
        },
        btnContainer: {},
        cancelBtn: {
            flex: 1,
            height: hp(42),
            marginTop: hp(16),
            backgroundColor: colors.btn_bg,
            borderColor:colors.border_gray,
            borderWidth:1,
            borderRadius: wp(42),
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        },
        cancelText: {
            ...commonFontStyle(600, 12, colors.black),
            textTransform: 'none',
        },
        diningView: {
            position: 'absolute',
            top: -2,
            right: 0,
            backgroundColor: colors.text_orange,
            paddingHorizontal: wp(6),
            paddingVertical: hp(2),
            borderRadius: 16,
        },
        diningText: {
            ...commonFontStyle(500, 12, colors.defult_white),
        },
        invoiveIcon: {
            width: wp(18),
            height: hp(18),
            resizeMode: 'contain',
            marginRight: wp(8),
        },
    });
};

export default OrderHistory;
