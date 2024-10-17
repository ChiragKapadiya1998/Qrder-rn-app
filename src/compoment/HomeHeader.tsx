import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation, useTheme } from '@react-navigation/native';
import { commonFontStyle, hp, wp } from '../theme/fonts';
import { Icons } from '../utils/images';
import { strings } from '../i18n/i18n';
import { useAppSelector } from '../redux/hooks';

type HomeProps = {
  onPressLocation?: () => void;
  onPressCart?: () => void;
  onPressProfile?: () => void;
  onRightPress?: () => void;
  onBackPress?: () => void;
  location?: any;
  mainShow?: any;
  rightShowView?: any;
  title?: string;
  extraStyle?: ViewStyle;
  isHideIcon?: boolean;
  rightText?: string;
  isShowIcon?: boolean;
  rightTextStyle: any;
  isCardIcon?: boolean;
  isCreateIcon?: boolean,
  createText?: string;
  isShowInvoice?: boolean
};

const HomeHeader = ({
  onPressLocation,
  onPressCart,
  location,
  mainShow,
  rightShowView,
  onRightPress,
  onBackPress,
  title = '',
  extraStyle = {},
  isHideIcon = false,
  rightText,
  isShowIcon = true,
  rightTextStyle,
  isCardIcon = false,
  isCreateIcon = false,
  createText,
  onRightPressNotification,
  isShowInvoice = false
}: HomeProps) => {
  const { navigate } = useNavigation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const { getCardData } = useAppSelector(state => state.data);
  const { isDarkTheme } = useAppSelector(state => state.common);

  const onPressBell = () => {
    // @ts-ignore
    navigate(screenName.Notifications);
  };

  if (mainShow) {
    return (
      <SafeAreaView edges={['top']} style={[styles?.container, extraStyle]}>
        <View style={styles.address_container}>
          <TouchableOpacity onPress={onBackPress}>
            <Image source={Icons?.back} style={styles?.backIcon} />
          </TouchableOpacity>
          <View style={[styles.headerTitle]}>
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>
        {isShowIcon ? (
          <TouchableOpacity onPress={onRightPress}>
            {isHideIcon ? (
              <Text style={[styles.resetText, rightTextStyle]}>
                {rightText}
              </Text>
            ) : (
              <View style={styles.bagView}>
                <Image source={Icons?.bagIcon} style={styles?.bag_logo} />
              </View>

            )}
          </TouchableOpacity>
        ) : null}
        {isCardIcon ? (
          <View>
            <Image source={Icons.cart1} style={styles.cardIcon} />
            <View style={styles.cardCount}>
              <Text style={styles.cardText}>{getCardData?.length}</Text>
            </View>
          </View>
        ) : null}
        {isCreateIcon ? isShowInvoice ?
          <TouchableOpacity onPress={onRightPress} style={styles.invoiceView}>
            <Image source={Icons.invoiceIcon} style={styles.invoiceIcons} />
            <Text style={styles.invoiceText}>{createText}</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity onPress={onRightPress} style={styles.createView}>
            <Image source={Icons.addItemIcon} style={styles.addItemIcon} />
            <Text style={styles.createText}>{createText}</Text>
          </TouchableOpacity>
          : null}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles?.container}>
      <View style={styles.address_container}>
        <TouchableOpacity onPress={onPressLocation} style={styles.location}>
          <Text style={styles.home_title}>{strings('home.Hello')}</Text>
          {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text numberOfLines={1} style={styles.addrs}>
              {'location'}
            </Text>
            <Image source={Icons?.arrow_down} style={styles?.arrow_down} />
          </View> */}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.location_icon1}
        onPress={() => {
          onRightPressNotification();
        }}>
        <Image source={Icons?.ic_bell} style={styles?.menuIcon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeHeader;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      backgroundColor: colors?.bg_white,
      paddingTop: hp(8),
      paddingBottom: hp(20),
      paddingHorizontal: wp(20),
      flexDirection: 'row',
      alignItems: 'center',
    },
    bag_logo: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
      tintColor:colors.black
    },
    bagView: {
      height: hp(35),
      width: wp(35),
      borderRadius: 10,
      backgroundColor: colors.cards_bg,
      alignItems: 'center',
      justifyContent: 'center'
    },
    arrow_down: {
      width: wp(9),
      height: wp(9),
      resizeMode: 'contain',
      tintColor: colors.black,
    },
    location: {
      marginLeft: 8,
    },
    headerTitle: {
      marginLeft: wp(12),
    },
    location_icon: {
      width: wp(45),
      height: wp(45),
      borderRadius: wp(45) / 2,
      backgroundColor: colors.back_bg,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    location_icon1: {
      width: wp(40),
      height: wp(40),
      borderRadius: 10,
      backgroundColor: colors.back_bg,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    backIcon: {
      width: wp(24),
      height: hp(24),
      tintColor: colors.black,
    },
    menuIcon: {
      width: wp(24),
      height: hp(24),
      tintColor: colors.black,
    },
    home_title: {
      ...commonFontStyle(700, 26, colors.black),
    },
    address_container: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    title: {
      ...commonFontStyle(800, 22, colors.black),
    },
    resetText: {
      ...commonFontStyle(400, 14, colors.text_orange),
      textDecorationLine: 'underline'
    },
    cardIcon: {
      width: 24,
      height: 24,
      tintColor: colors.Primary_Orange,
    },
    cardCount: {
      position: 'absolute',
      backgroundColor: colors.Primary_Orange,
      width: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16 / 2,
      right: -4,
      top: -5,
    },
    cardText: {
      ...commonFontStyle(700, 10, colors.white),
    },
    createText: {
      marginLeft: wp(8),
      ...commonFontStyle(600, 12, colors.defult_white),
    },
    invoiceText: {
      marginLeft: wp(8),
      ...commonFontStyle(600, 12, colors.black),
    },
    createView: {
      backgroundColor: colors.text_orange,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(10),
      paddingVertical: hp(8),
      borderRadius: 8,
    },
    invoiceView: {
      backgroundColor: colors.cards_bg,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(12),
      paddingVertical: hp(5),
      borderRadius: 16,
    },
    addItemIcon: {
      width: 12,
      height: 12,
      tintColor: colors.defult_white
    },
    invoiceIcons: {
      width: 18,
      height: 18,
      tintColor: colors.text_orange
    }
  });
};
