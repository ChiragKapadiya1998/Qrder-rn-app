import React from 'react';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {Image, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {commonFontStyle, hp, isIos, SCREEN_WIDTH, wp} from '../theme/fonts';
import {screenName} from './screenNames';
import {CommonActions, StackActions, useTheme} from '@react-navigation/native';
import {Icons} from '../utils/images';
import ChefHome from '../screens/ChefSelf/ChefHome';
import ChefProfile from '../screens/ChefSelf/ChefProfile';
import ChefFoodList from '../screens/ChefSelf/ChefMenuList';
import ChefNotification from '../screens/ChefSelf/ChefNotification';
import ChefMenuList from '../screens/ChefSelf/ChefMenuList';
import StudentHome from '../screens/StudentAuth/StudentHome';
import StudentProfile from '../screens/StudentAuth/StudentProfile';
import StudentNotification from '../screens/StudentAuth/StudentNotification';
import StudentOrderHistory from '../screens/StudentAuth/StudentOrderHistory';
import {useAppSelector} from '../redux/hooks';
import {StudentHomeStack} from './StackNavigator';

const Tab = createBottomTabNavigator();

const TabBarItem = ({state, navigation}: BottomTabBarProps) => {
  const {colors} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const {getCardData} = useAppSelector(state => state.data);

  const getIcons = (key: number, isFocused: boolean) => {
    switch (key) {
      case 0:
        return (
          <Image
            source={Icons.ic_home}
            style={{
              width: 20,
              height: 20,
              tintColor: isFocused ? colors.Primary_Orange : colors.tabBar,
            }}
          />
        );
      case 1:
        return (
          <View>
            <Image
              source={Icons.ic_list}
              style={{
                width: 24,
                height: 24,
                tintColor: isFocused ? colors.Primary_Orange : colors.tabBar,
              }}
            />
            {getCardData?.length !== 0 && (
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: colors.Primary_Orange,
                  width: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 16 / 2,
                  right: -4,
                  top: -5,
                }}>
                <Text
                  style={{
                    ...commonFontStyle(700, 10, colors.white),
                  }}>
                  {getCardData?.length}
                </Text>
              </View>
            )}
          </View>
        );

      case 2:
        return (
          <Image
            source={Icons.ic_bell}
            style={{
              width: 24,
              height: 24,
              tintColor: isFocused ? colors.Primary_Orange : colors.tabBar,
            }}
          />
        );

      case 3:
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
        return 'Notification';
      case 3:
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

function StudentBottomBar() {
  const {colors} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);

  return (
    <Tab.Navigator
      tabBar={props => <TabBarItem {...props} />}
      initialRouteName={screenName.student_tab_bar.StudentHome}
      screenOptions={{
        headerShown: false,
        unmountOnBlur: true,
        tabBarStyle: {
          height: 55,
        },
      }}>
      <Tab.Screen
        name={screenName.student_tab_bar.StudentHome}
        component={StudentHomeStack}
      />
      <Tab.Screen
        name={screenName.student_tab_bar.StudentOrderHistory}
        component={StudentOrderHistory}
      />
      <Tab.Screen
        name={screenName.student_tab_bar.StudentNotification}
        component={StudentNotification}
      />
      <Tab.Screen
        name={screenName.student_tab_bar.StudentProfile}
        component={StudentProfile}
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

export default StudentBottomBar;
