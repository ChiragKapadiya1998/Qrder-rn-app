import React from 'react';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {Image, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {commonFontStyle, hp, isIos, SCREEN_WIDTH, wp} from '../theme/fonts';
import {screenName} from './screenNames';
import {useTheme} from '@react-navigation/native';
import {Icons} from '../utils/images';
import ChefHome from '../screens/ChefSelf/ChefHome';
import ChefProfile from '../screens/ChefSelf/ChefProfile';
import ChefFoodList from '../screens/ChefSelf/ChefMenuList';
import ChefNotification from '../screens/ChefSelf/ChefNotification';
import ChefMenuList from '../screens/ChefSelf/ChefMenuList';

const Tab = createBottomTabNavigator();

const TabBarItem = ({state, navigation}: BottomTabBarProps) => {
  const {colors} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);

  const getIcons = (key: number, isFocused: boolean) => {
    switch (key) {
      case 0:
        return (
          <Image
            source={Icons.ic_home}
            style={{
              width: 24,
              height: 24,
              tintColor: isFocused ? colors.Primary_Orange : colors.tabBar,
            }}
          />
        );
      case 1:
        return (
          <Image
            source={Icons.ic_history}
            style={{
              width: 24,
              height: 24,
              tintColor: isFocused ? colors.Primary_Orange : colors.tabBar,
            }}
          />
        );

      case 2:
        return (
          <Image
            source={Icons.ic_user}
            style={{
              width: 24,
              height: 24,
              tintColor: isFocused ? colors.Primary_Orange : colors.tabBar,
            }}
          />
        );
      default:
        break;
    }
  };

  const getText = (key: number) => {
    switch (key) {
      case 0:
        return 'Home';
      case 1:
        return 'History';
      case 2:
        return 'Profile';
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.itemContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={[
              styles.itemViewContainer,
              // isFocused && styles.itemFocusContainer,
            ]}>
            {getIcons(index, isFocused)}
            <Text
              numberOfLines={1}
              style={{
                ...styles.itemLabelTextStyle,
                // bottom: index == 2 ? SCREEN_HEIGHT * 0.019 : 0,
                color: isFocused ? colors.text_orange : colors.title_dec,
              }}>
              {getText(index)}
            </Text>
          </Pressable>
        );
      })}
    </SafeAreaView>
  );
};

function ChefSelfBottomBar() {
  const {colors, isDark} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);

  return (
    <Tab.Navigator
      tabBar={props => <TabBarItem {...props} />}
      initialRouteName={screenName.chef_tab_bar.ChefHome}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name={screenName.chef_tab_bar.ChefHome}
        component={ChefHome}
      />
      <Tab.Screen
        name={screenName.chef_tab_bar.ChefMenuList}
        component={ChefMenuList}
      />
      {/* <Tab.Screen
        name={screenName.chef_tab_bar.ChefNotification}
        component={ChefNotification}
      /> */}
      <Tab.Screen
        name={screenName.chef_tab_bar.ChefProfile}
        component={ChefProfile}
      />
    </Tab.Navigator>
  );
}

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    itemContainer: {
      height: hp(65),
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    itemViewContainer: {
      flex: 1,
      height: hp(60),
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      marginBottom: Platform.OS === 'ios' ? hp(30) : 0,
    },
    itemFocusContainer: {
      // backgroundColor: 'red',
      paddingHorizontal: wp(10),
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
    },
    itemLabelTextStyle: {
      ...commonFontStyle(400, 12, colors.black),
      marginTop: hp(5),
    },
  });
};

export default ChefSelfBottomBar;
