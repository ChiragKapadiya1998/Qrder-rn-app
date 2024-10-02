import { Alert, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import HomeHeader from '../../compoment/HomeHeader';
import { strings } from '../../i18n/i18n';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import ThankYouModal from '../../compoment/ThankYouModal';


const MyOrders = () => {
    const { colors } = useTheme();
    const route = useRoute();
    const { roll } = route?.params;
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    const navigation = useNavigation();
    const { isDarkTheme } = useAppSelector(state => state.common);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const dispatch = useAppDispatch();

    const goback = () => {
        navigation.goBack();
    }

    const onPressGoToHome = () => {
        setIsOpenModal(false)
    }

    const closeModal = () => {
        setIsOpenModal(false)
    }

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
                    setIsOpenModal(true)
                    // navigation.navigate(screenName.AddItemMasters);
                    // setNewFolder(true)
                }}
                mainShow={true}
                title={strings('myOrders.my_orders')}
                extraStyle={styles.headerContainer}
                createText={strings('profileScreen.download_invoice')}
                isShowIcon={false}
                isCreateIcon={roll === 'staff' ? false : true}
                isShowInvoice={true}
            />
            <ScrollView style={styles.subContainer} showsVerticalScrollIndicator={false}>
                {roll === 'staff' ? null :
                    <>
                        <Text style={styles.orederText}>{strings('myOrders.order_details')}</Text>
                        <View style={styles.orderBox}>
                            <View style={[styles.comanStyle]}>
                                <Text style={styles.priText}>{strings('myOrders.order_id')}</Text>
                                <Text style={[styles.priText, { color: colors.black }]}>{'#326589'}</Text>
                            </View>
                            <View style={[styles.comanStyle, { marginVertical: hp(12) }]}>
                                <Text style={styles.priText}>{strings('myOrders.user_name')}</Text>
                                <Text style={[styles.priText, { color: colors.black }]}>{`Kartik Patel`}</Text>
                            </View>
                            <View style={styles.comanStyle}>
                                <Text style={styles.priText}>{strings('myOrders.phone_number')}</Text>
                                <Text style={[styles.priText, { color: colors.black }]}>{'+91 123 456 7890'}</Text>
                            </View>
                            <View style={[styles.comanStyle, { marginVertical: hp(12) }]}>
                                <Text style={styles.priText}>{strings('myOrders.subtotal')}</Text>
                                <Text style={[styles.priText, { color: colors.black }]}>{`₹${250}`}</Text>
                            </View>
                            <View style={[styles.comanStyle]}>
                                <Text style={styles.priText}>{strings('myOrders.discount')}</Text>
                                <Text style={[styles.priText, { color: colors.red_text }]}>{`-₹${250}`}</Text>
                            </View>
                            <View style={[styles.comanStyle, { marginVertical: hp(12) }]}>
                                <Text style={styles.priText}>{strings('myOrders.tax')}</Text>
                                <Text style={[styles.priText, { color: colors.black }]}>{`₹${250}`}</Text>
                            </View>
                            <View style={[styles.comanStyle]}>
                                <Text style={styles.priText}>{strings('myOrders.platform_free')}</Text>
                                <Text style={[styles.priText, { color: colors.black }]}>{`₹${25}`}</Text>
                            </View>
                            <View style={[styles.comanStyle, { marginTop: hp(12) }]}>
                                <Text style={styles.priText}>{strings('myOrders.created_date')}</Text>
                                <Text style={[styles.priText, { color: colors.green_text }]}>{'18 January 2024'}</Text>
                            </View>
                            <View style={styles.borderLine} />
                            <View style={styles.comanStyle}>
                                <Text style={styles.priText}>{strings('foodCart.total_pay')}</Text>
                                <Text style={styles.totalPrice}>{`₹${250}`}</Text>
                            </View>
                        </View>
                    </>
                }
                <Text style={styles.addressText}>{strings('myOrders.address_details')}</Text>
                <View style={styles.cardContainer}>
                    {roll === 'staff' ? <>
                        <View style={styles.boxView}>
                            <Text style={styles.textStyle}>{strings('myOrders.user_name')}</Text>
                            <Text style={styles.nameText}>{'Kartik Patel'}</Text>
                        </View>
                        <View style={[styles.boxView, { marginVertical: hp(12) }]}>
                            <Text style={styles.textStyle}>{strings('myOrders.address')}</Text>
                            <Text style={styles.nameText}>{'Room 500 hostel'}</Text>
                        </View>
                        <View style={styles.boxView}>
                            <Text style={styles.textStyle}>{strings('myOrders.phone_number')}</Text>
                            <Text style={styles.nameText}>{'+91 123 456 7890'}</Text>
                        </View>
                    </> :
                        <View style={styles.boxView}>
                            <Text style={styles.textStyle}>{strings('myOrders.canteen_address')}</Text>
                            <Text style={styles.nameText}>{'Room 500 hostel'}</Text>
                        </View>}
                    <View style={[styles.boxView, { marginTop: hp(12) }]}>
                        <Text style={styles.textStyle}>{strings('myOrders.dining_parcel')}</Text>
                        <View style={styles.diningView}>
                            <Text style={[styles.diningText]}>Dining</Text>
                        </View>
                    </View>
                </View>
                <Text style={[styles.addressText, { marginTop: hp(20) }]}>{strings('myOrders.items')}</Text>
                <FlatList
                    data={[1, 2, 3, 4]}
                    renderItem={({ item }) => (
                        <View style={styles.headingView}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.imageStyle} />
                                <View style={{ marginLeft: wp(10), flex: 1 }}>
                                    <Text style={styles.itemText}>{'Item : 1'}</Text>
                                    <Text style={styles.foodText}>{'Item Name'}</Text>
                                    <Text numberOfLines={1} style={styles.leftText}>{'Description'}</Text>
                                    <View style={styles.addContiner}>
                                        <Text style={styles.priceText}>{`₹${300}`}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item.toString()}
                    contentContainerStyle={styles.containerView}
                />
            </ScrollView>
            <ThankYouModal
                title={strings('myOrders.thank_you_des')}
                title1={strings('myOrders.thank_you')}
                rightText={strings('myOrders.go_to_home')}
                visible={isOpenModal}
                closeModal={() => closeModal()}
                onPressGoToHome={() => onPressGoToHome()}
            />
        </View>
    );
}
export default MyOrders

const getGlobalStyles = (props: any) => {
    const { colors } = props;
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.bg_white,
        },
        headerContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        subContainer: {
            marginHorizontal: wp(20)
        },
        orederText: {
            marginBottom: hp(20),
            ...commonFontStyle(600, 18, colors.black),
        },
        orderBox: {
            backgroundColor: colors.cards_bg,
            paddingHorizontal: wp(16),
            paddingVertical: hp(16),
            borderRadius: 16,
            marginTop: hp(8)
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
        addressText: {
            ...commonFontStyle(600, 18, colors.black),
        },
        cardContainer: {
            backgroundColor: colors.cards_bg,
            padding: 16,
            borderRadius: 16,
            marginTop: hp(8)
        },
        boxView: {
            justifyContent: 'space-between',
            flexDirection: 'row'
        },
        textStyle: {
            ...commonFontStyle(500, 14, colors.title_dec100),
        },
        nameText: {
            ...commonFontStyle(600, 14, colors.black),
        },
        diningView: {
            backgroundColor: colors.text_orange,
            paddingHorizontal: wp(6),
            paddingVertical: hp(2),
            borderRadius: 16,
        },
        diningText: {
            ...commonFontStyle(500, 10, colors.defult_white),
        },
        containerView: {
            gap: 20,
            marginTop: hp(20)
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
        itemText: {
            ...commonFontStyle(400, 10, colors.text_orange),
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
    });
};
