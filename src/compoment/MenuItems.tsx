import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useTheme } from '@react-navigation/native';
import { commonFontStyle, hp, SCREEN_WIDTH, wp } from '../theme/fonts';
import { Icons } from '../utils/images';
import { Menu, MenuDivider, MenuItem } from 'react-native-material-menu';
import { strings } from '../i18n/i18n';
import { screenName } from '../navigation/screenNames';

export interface ListObj {
    title: string;
    iconName?: any;
    images?: string[];
    name?: string;
    cuisine_name?: string;
    price?: number;
}
type ItemProps = {
    item: ListObj;
    setDelete?: any
    showChef: any
    index: any
};


const MenuItems = ({ item, index, setDelete, showChef }: ItemProps) => {
    const { colors } = useTheme();
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);

    const onPressedit = () => {
        hideMenu();
        const clear = setTimeout(() => {
            navigation.navigate(screenName.EditFoodDetails, { itemData: item })
        }, 500);
        return () => {
            clearTimeout(clear);
        };
    };

    const hideMenu = () => setVisible(false);

    const showMenu = () => setVisible(true);

    const onPressDelete = () => {
        setDelete(true);
    };

    const containerWidth = (SCREEN_WIDTH - 56) / 2;
    const containerHeight = 100;
    const xPosition = index % 2 === 0 ? 0 : 10;

    return (
        <View style={styles.boxView}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate(screenName.FoodDetails, { itemData: item, showChef: showChef, showAddToCard: false })
                }}
                activeOpacity={0.7}
                style={{
                    width: containerWidth,
                    marginLeft: xPosition,
                }}>
                <View
                    style={[
                        styles.renderContainer,
                        {
                            // height: 210,
                            backgroundColor: colors.cards_bg,
                        },
                    ]}>
                    <View style={[styles.imageView]}>
                        <Image
                            source={{ uri: item.image }}
                            style={[styles.imageStyle]}
                        />
                    </View>
                    <Text numberOfLines={1} style={styles.titleText}>{item?.name}</Text>
                    <Text numberOfLines={1} style={styles.desText}>{item?.description}</Text>
                    <Text style={styles.priceText}> {`₹${item?.price}`}</Text>
                </View>
            </TouchableOpacity>

            {/* <TouchableOpacity activeOpacity={0.5} onPress={() => {
                navigation.navigate(screenName.FoodDetails, { itemData: item, showChef: showChef, showAddToCard: false })
            }} style={styles.subBoxView}>
                {item.images[0] ? (
                    <Image source={{ uri: item.images[0] }} style={[styles.imageView, { backgroundColor: colors.image_Bg_gray }]} />
                ) : (
                    <View
                        style={[
                            styles.imageView,
                            { backgroundColor: colors.image_Bg_gray },
                        ]}
                    />
                )}
                <View style={styles.container}>
                    <View style={styles.leftView}>
                        <Text style={styles.titleText}> {item?.name}</Text>
                        {!showChef && <View style={styles.rightContainers}>
                            <Menu
                                visible={visible}
                                style={styles.boxMenu}
                                anchor={
                                    <TouchableOpacity onPress={showMenu}>
                                        <Image source={Icons.optionIcon} style={styles.optionIcon} />
                                    </TouchableOpacity>
                                }
                                onRequestClose={hideMenu}>
                                <MenuItem textStyle={styles.menuTextStyle} onPress={onPressedit}>
                                    {strings('myMenuList.edit')}
                                </MenuItem>
                                <MenuDivider />
                                <MenuItem
                                    textStyle={{ ...styles.menuTextStyle, color: colors.black }}
                                    onPress={() => {
                                        hideMenu();
                                        setTimeout(() => {
                                            onPressDelete();
                                        }, 500);
                                    }}>
                                    {strings('myMenuList.delete')}
                                </MenuItem>
                            </Menu>
                        </View>}
                    </View>
                    <View style={styles.rateView}>
                        <View style={styles.breakfastView}>
                            <Text style={styles.breakfastText}> {item.cuisine_name}</Text>
                        </View>
                        <Text style={styles.priceText}> {`₹${item.price}`}</Text>
                    </View>

                    <View style={styles.rateView}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={Icons.star} style={styles.starStyle} />
                            <Text style={styles.rateText}>4.9</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity> */}
        </View>
    )
}
export default MenuItems

const getGlobalStyles = (props: any) => {
    const { colors } = props;
    return StyleSheet.create({
        boxView: {
            marginTop: hp(5),
            flex: 1
        },
        renderContainer: {
            width: '100%',
            borderRadius: 20,
            paddingVertical: hp(10),
            paddingHorizontal: wp(12)
        },
        subBoxView: {
            flexDirection: 'row',
        },
        container: {
            flex: 1,
            marginLeft: wp(12),
            // paddingTop: hp(11),
        },
        leftView: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        titleText: {
            marginTop: hp(12),
            ...commonFontStyle(600, 16, colors.black),
        },
        desText: {
            ...commonFontStyle(500, 12, colors.title_dec100),
        },
        optionIcon: {
            width: wp(24),
            height: hp(24),
        },
        pickUpText: {
            ...commonFontStyle(400, 14, colors.tabBar),
        },
        breakfastView: {
            backgroundColor: colors.orange_bg,
            alignSelf: 'flex-start',
            paddingHorizontal: wp(12),
            paddingVertical: hp(2),
            borderRadius: 29,
        },
        priceText: {
            marginTop: hp(4),
            ...commonFontStyle(600, 14, colors.text_orange),
        },
        breakfastText: {
            ...commonFontStyle(400, 14, colors.Primary_Orange),
        },
        itemsText: {
            ...commonFontStyle(400, 14, colors.gray_400),
        },
        rateView: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        starStyle: {
            width: 17,
            height: 17,
        },
        rateText: {
            marginLeft: 4,
            ...commonFontStyle(700, 14, colors.Primary_Orange),
        },
        rateText1: {
            ...commonFontStyle(400, 14, colors.tabBar),
            marginLeft: 9,
        },
        rightContainers: {
            alignItems: 'flex-end',
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
        menuTextStyle: {
            ...commonFontStyle(400, 16, colors.black),
        },
        boxMenu: {
            backgroundColor: colors.card_bg
        },
        imageView: {
            // width: wp(48),
            // height: wp(48),
            // borderRadius: wp(48),
            // backgroundColor: colors.cards_bg,
            alignItems: "center",
            justifyContent: 'center',
        },
        imageStyle: {
            width: wp(135),
            height: hp(113),
            borderRadius: 16,
            // backgroundColor: 'red',
            resizeMode: 'stretch'
        }
    });
};
