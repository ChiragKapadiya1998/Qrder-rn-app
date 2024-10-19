import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {commonFontStyle, hp, wp} from '../theme/fonts';
import CCModal from './CCModal';
import {getAsyncUserInfo} from '../utils/asyncStorageManager';
type Props = {
  visible?: boolean;
  closeModal: () => void;
  title?: string;
};

const ReviewModal = ({visible, closeModal, title}: Props) => {
  const {colors, isDark} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const [userData, setUserData] = useState<any>({});

  const fetchUserInfo = async () => {
    try {
      const userList = await getAsyncUserInfo();
      setUserData(userList);
    } catch (error) {}
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, []),
  );

  return (
    <View>
      <CCModal
        visible={visible}
        close={closeModal}
        containStyle={{
          alignItems: 'flex-start',
          paddingHorizontal: wp(16),
          paddingTop: hp(20),
          paddingBottom: hp(36),
        }}
        contain={
          <View>
            <Text style={styles.containerContain}>{title}</Text>
            <TouchableOpacity
              onPress={() => {
                if (userData?.google_review_link) {
                  Linking.openURL(userData?.google_review_link);
                } else {
                  Linking.openURL('https://g.co/kgs/8hUXnYs');
                }
              }}>
              <Text style={styles.linkText}>
                {userData?.google_review_link
                  ? userData?.google_review_link
                  : 'https://g.co/kgs/8hUXnYs'}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default ReviewModal;

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    containerContain: {
      ...commonFontStyle(500, 14, colors.black),
    },
    linkText: {
      marginTop: hp(19),
      textDecorationLine: 'underline',
      ...commonFontStyle(400, 14, colors.black),
    },
  });
};
