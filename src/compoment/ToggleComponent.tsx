import {
  Easing,
  FlatList,
  Image,
  ReturnKeyType,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useEffect, useMemo, useRef } from 'react';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { commonFontStyle, hp, SCREEN_WIDTH, wp } from '../theme/fonts';
import { Icons } from '../utils/images';
import { useAppSelector } from '../redux/hooks';

type Props = {
  value: string;
  onValueChange: () => void;
  disabled?: boolean;
  trackColor: string;
  toggleContainerStyle?: ViewStyle;
  toggleWheel?: ViewStyle;
  isFood?: boolean
};

const ToggleComponent = ({
  value = false,
  onValueChange = () => { },
  disabled = false,
  trackColor,
  toggleContainerStyle,
  toggleWheel,
  isFood
}: Props) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const { isDarkTheme, isLanguage } = useAppSelector(state => state.common);

  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const TOGGLE_LEFT_MARGIN = 3;
  const TOGGLE_RIGHT_MARGIN = isFood ? 17 : 22;
  const moveToggle = useMemo(
    () =>
      animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [TOGGLE_LEFT_MARGIN, TOGGLE_RIGHT_MARGIN],
      }),
    [animatedValue],
  );

  // const trackColor = value
  //   ? !isDarkTheme
  //     ? colors.image_bg
  //     : colors.input_bg1
  //   : !isDarkTheme
  //   ? colors.image_bg
  //   : colors.input_bg1;
  const opacity = disabled ? 0.5 : 1;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      easing: Easing.elastic(0.9),
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={disabled ? undefined : () => onValueChange(!value)}>
        <View
          style={[
            styles.toggleContainer,
            { backgroundColor: trackColor, opacity }, toggleContainerStyle
          ]}>
          <Animated.View
            style={[styles.toggleWheelStyle, { marginLeft: moveToggle }, toggleWheel]}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default ToggleComponent;
const TOGGLE_LEFT_MARGIN = 3;
const TOGGLE_RIGHT_MARGIN = 22;
const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    toggleContainer: {
      width: 50,
      height: 30,
      marginLeft: TOGGLE_LEFT_MARGIN,
      borderRadius: 15,
      justifyContent: 'center',
    },
    toggleWheelStyle: {
      width: 25,
      height: 25,
      borderRadius: 12.5,
      shadowColor: '#000',
      backgroundColor: 'white',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2.5,
      elevation: 1.5,
    },
  });
};
