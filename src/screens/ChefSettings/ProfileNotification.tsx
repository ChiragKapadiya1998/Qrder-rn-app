import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {
  commonFontStyle,
  hp,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  wp,
} from '../../theme/fonts';
import NoDataFound from '../../compoment/NoDataFound';
import Loader from '../../compoment/Loader';
import Spacer from '../../compoment/Spacer';
import HomeHeader from '../../compoment/HomeHeader';
import {strings} from '../../i18n/i18n';
import {Icons} from '../../utils/images';
type Props = {};

const ProfileNotification = ({}: Props) => {
  const {colors, isDark} = useTheme();
  const navigation = useNavigation();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View>
        <View style={styles.subBoxView}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.leftImage}>
              <Image source={Icons.image1} style={styles.image1} />
            </View>
            <View style={{marginLeft: wp(14)}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text numberOfLines={2} style={styles.firstText}>
                  {'Deals Just For You!'}
                </Text>
                <View style={styles.viewDot} />
              </View>
              <Text style={[styles.firstText1]}>
                {'Lorem ipsum dolor sit amet, consectetur'}
              </Text>
              <Text style={styles.timeText}>20 min ago</Text>
            </View>
          </View>
          {/* <View style={styles.rightImage} /> */}
        </View>
        <View style={styles.borderLine} />
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <HomeHeader
        onBackPress={() => {
          navigation.goBack();
        }}
        onRightPress={() => {
          console.log('dee');
        }}
        mainShow={true}
        title={strings('notifications.notifications')}
        extraStyle={styles.headerContainer}
        isShowIcon={false}
      />
      <View style={styles.boxContainer}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReachedThreshold={0.3}
          data={[1, 2, 3, 4, 5, 6, 7, 8]}
          //   data={[]}
          ListEmptyComponent={() => {
            return (
              <View>
                <Image source={Icons.noData} style={styles.noDataIcon} />
              </View>
            );
          }}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => {
            return (
              <View>
                {/* {true && <Loader size={'small'} />} */}
                <Spacer height={hp(70)} />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default ProfileNotification;

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    boxContainer: {
      flex: 1,
      marginHorizontal: wp(16),
    },
    headerContainer: {
      backgroundColor: colors.white,
      marginBottom: hp(10),
    },
    subBoxView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    leftImage: {
      width: wp(54),
      height: wp(54),
      borderRadius: wp(8),
      backgroundColor: colors.cards_bg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    firstText: {
      ...commonFontStyle(700, 17, colors.black),
    },
    firstText1: {
      ...commonFontStyle(400, 12, colors.title_dec100),
    },
    timeText: {
      paddingTop: hp(3),
      ...commonFontStyle(400, 10, colors.dropDownText),
    },
    rightImage: {
      width: wp(54),
      height: wp(54),
      borderRadius: wp(10),
      backgroundColor: colors.image_Bg_gray,
    },
    borderLine: {
      borderColor: colors.border_line2,
      borderWidth: 1,
      marginVertical: hp(16),
    },

    image1: {
      width: wp(22),
      height: wp(22),
    },
    viewDot: {
      width: wp(6),
      height: wp(6),
      borderRadius: wp(6) / 2,
      backgroundColor: colors.text_orange,
      marginLeft: 6,
    },
    noDataIcon: {
      width: wp(170),
      height: wp(120),
      position: 'absolute',
      alignSelf: 'center',
      top: SCREEN_HEIGHT * 0.23,
    },
  });
};
