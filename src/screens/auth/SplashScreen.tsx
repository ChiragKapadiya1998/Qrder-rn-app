import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import React, {useEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../theme/fonts';
import {AppStyles} from '../../theme/appStyles';
import {screenName} from '../../navigation/screenNames';
import {dispatchNavigation} from '../../utils/globalFunctions';
import {getAsyncRole, getAsyncToken} from '../../utils/asyncStorageManager';
import {Icons} from '../../utils/images';
import {
  onBackgroundNotificationPress,
  onMessage,
  onNotificationPress,
  openAppNotifiactionEvent,
} from '../../utils/notificationHandle';
import {getUserAction} from '../../actions/authAction';
import {useAppDispatch} from '../../redux/hooks';

type Props = {};

const SplashScreen = (props: Props) => {
  const {colors, isDark} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTimeout(() => {
      getUserInfo();
    }, 1000);
    onMessage();
    onNotificationPress();
    onBackgroundNotificationPress();
    openAppNotifiactionEvent();
  }, []);

  const getUserInfo = async () => {
    let isUser = await getAsyncToken();
    let isRole = await getAsyncRole();
    if (isUser) {
      if (isRole == 'Student') {
        let obj = {
          onSuccess: (res: any) => {
            if (res?.university_id) {
              dispatchNavigation(screenName.StudentBottomBar);
            } else {
              dispatchNavigation(screenName.StudentSelect);
            }
          },
          onFailure: (Err: any) => {},
        };
        dispatch(getUserAction(obj));
      } else if (isRole == 'Staff') {
        dispatchNavigation(screenName.ChefSelfBottomBar);
      } else {
        dispatchNavigation(screenName.BottomTabBar);
      }
    } else {
      dispatchNavigation(screenName.SignInScreen);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'} />
      <View style={[AppStyles.flex]}>
        <Image style={styles.mainImage} source={Icons.launch_screen} />
      </View>
    </View>
  );
};

export default SplashScreen;

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
    },
    mainImage: {
      height: SCREEN_HEIGHT,
      width: SCREEN_WIDTH,
      resizeMode: 'cover',
    },
  });
};
