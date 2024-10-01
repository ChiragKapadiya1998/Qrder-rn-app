import {
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useAppSelector } from '../../redux/hooks';
import HomeHeader from '../../compoment/HomeHeader';
import { strings } from '../../i18n/i18n';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { Icons } from '../../utils/images';
import Input from '../../compoment/Input';
import PrimaryButton from '../../compoment/PrimaryButton';

const FoodCart = () => {
    const { navigate } = useNavigation();
    const { colors } = useTheme();
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    const { getCardData } = useAppSelector(state => state.data);
    const { isDarkTheme } = useAppSelector(state => state.common);
    const [address, setAddress] = useState < string > ('');
    const [loading, setLoading] = useState(false);

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkTheme ? 'light-content' : 'dark-content'} backgroundColor={colors.white} />
            <HomeHeader
                onBackPress={() => {
                    navigate.goBack();
                }}
                onRightPress={() => {
                    navigate.navigate('FoodCart');
                }}
                mainShow={true}
                title={strings('foodDetails.food_cart')}
                extraStyle={styles.headerContainer}
                isHideIcon={true}
            />

            <View style={{ flex: 0.5 }}>
                <FlatList
                    data={[1, 2, 3, 4, 5, 6, 7, 8]}
                    renderItem={({ item }) => (
                        <View style={styles.headingView}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.imageStyle} />
                                <View style={{ marginLeft: wp(10), flex: 1 }}>
                                    <Text style={styles.foodText}>{'sdasd'}</Text>
                                    <Text numberOfLines={1} style={styles.leftText}>{'sdasdasd'}</Text>
                                    <View style={styles.addContiner}>
                                        <Text style={styles.priceText}>{`₹${300}`}</Text>
                                        <View style={styles.addItemView}>
                                            <TouchableOpacity onPress={() => handleDecrement(item.id)}>
                                                <Image source={Icons.minus} style={styles.decrementIcons} />
                                            </TouchableOpacity>
                                            <Text style={styles.countText}>{3}</Text>
                                            <TouchableOpacity onPress={() => handleIncrement(item.id)}>
                                                <Image source={Icons.plus} style={styles.plusIcons} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                    contentContainerStyle={styles.containerView}
                />
            </View>

            <View style={{ flex: 1, paddingHorizontal: wp(20), marginTop: hp(16) }}>
                <Text style={styles.summaryText}>{'Summary'}</Text>
                <View style={[styles.comanStyle, { marginTop: hp(8) }]}>
                    <Text style={styles.priText}>{'Price(2 item)'}</Text>
                    <Text style={[styles.priText, { color: colors.black }]}>{`₹${300}`}</Text>
                </View>
                <View style={[styles.comanStyle, { marginVertical: hp(12) }]}>
                    <Text style={styles.priText}>{'Discount'}</Text>
                    <Text style={[styles.priText, { color: colors.black }]}>{`₹${300}`}</Text>
                </View>
                <View style={styles.comanStyle}>
                    <Text style={styles.priText}>{'Delivery Change'}</Text>
                    <Text style={[styles.priText, { color: colors.green_text }]}>{'Free Delivery'}</Text>
                </View>
                <View style={styles.borderLine} />
                <View style={styles.comanStyle}>
                    <Text style={styles.priText}>{'Total Pay'}</Text>
                    <Text style={[styles.totalPrice]}>{`₹${300}`}</Text>
                </View>
                <Input
                    value={address}
                    placeholder={strings('sign_up.add_address')}
                    label={strings('sign_up.address')}
                    onChangeText={(t: string) => setAddress(t)}
                    isShowLabel={true}
                    inputStyle={styles.inputStyle}
                />
            </View>
            <View style={styles.buttonContainer}>
                <PrimaryButton
                    extraStyle={styles.submitButton}
                    // onPress={onPressEdit}
                    title={strings('sign_up.pay_now')}
                    titleStyle={styles.submitText}
                    isLoading={loading}
                />
            </View>
        </View>
    );
};

export default FoodCart;

const getGlobalStyles = (props: any) => {
    const { colors } = props;
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors?.bg_white,
        },
        containerView: {
            marginHorizontal: wp(20),
            gap: 16,
        },
        headingView: {
            backgroundColor: colors.cards_bg,
            borderRadius: 16,
            paddingVertical: hp(10),
            paddingHorizontal: wp(16),
        },
        imageStyle: {
            width: 89,
            height: 89,
            borderRadius: 16,
            resizeMode: 'contain',
            backgroundColor: 'red',
        },
        foodText: {
            ...commonFontStyle(600, 14, colors.black),
        },
        addContiner: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: hp(10),
        },
        priceText: {
            ...commonFontStyle(600, 16, colors.text_orange),
        },
        leftText: {
            ...commonFontStyle(500, 12, colors.title_dec100),
        },
        addItemView: {
            height: hp(32),
            borderColor: colors.text_orange,
            borderWidth: 1,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            paddingHorizontal: wp(10),
        },
        countText: {
            marginHorizontal: wp(10),
            ...commonFontStyle(600, 14, colors.black),
        },
        decrementIcons: {
            width: 18,
            height: 18,
            resizeMode: 'contain',
            tintColor: colors.text_orange,
        },
        plusIcons: {
            width: 12,
            height: 12,
            resizeMode: 'contain',
            tintColor: colors.text_orange,
        },
        summaryText: {
            ...commonFontStyle(600, 18, colors.black),
        },
        priText: {
            ...commonFontStyle(500, 14, colors.title_dec100),
        },
        totalPrice: {
            ...commonFontStyle(600, 20, colors.text_orange),
        },
        borderLine: {
            borderBottomColor: colors.text_gray,
            borderBottomWidth: 1,
            borderStyle: 'dashed',
            marginVertical: hp(12)
        },
        comanStyle: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        inputStyle: {
            borderColor: colors.text_orange
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
        submitText: {
            ...commonFontStyle(600, 18, colors.defult_white),
        },
    });
};
