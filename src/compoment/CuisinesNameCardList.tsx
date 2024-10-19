import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {commonFontStyle, hp, wp} from '../theme/fonts';
import {Icons} from '../utils/images';
import {Menu, MenuDivider, MenuItem} from 'react-native-material-menu';
import {strings} from '../i18n/i18n';
import {screenName} from '../navigation/screenNames';
import Spacer from './Spacer';

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
  setDelete?: any;
  onPressEdit?: any;
  isRecipeMaster?: boolean;
  isShowPrice?: boolean;
};

const CuisinesNameCardList = ({
  item,
  setDelete,
  onPressEdit,
  isRecipeMaster = false,
  isShowPrice = false,
  showIcon,
}: ItemProps) => {
  const {colors} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const onPressDelete = () => {
    setDelete(true);
  };

  return (
    <View style={[styles.boxView]}>
      <View style={styles.subBoxView}>
        <View style={styles.container}>
          <View style={[styles.leftView, {paddingHorizontal: wp(16)}]}>
            <View style={[styles.viewStyle, {flex: 1}]}>
              {/* {isRecipeMaster ? null : (
                <Image source={{uri: item.image}} style={styles.imageStyle} />
              )} */}
              <Text numberOfLines={1} style={styles.titleText}>
                {item?.name || item?.menu_name}
              </Text>
            </View>
            {isShowPrice ? (
              <Text style={[styles.titleText]}>{parseInt(item?.price)}</Text>
            ) : null}
            <View style={styles.viewStyle}>
              {showIcon ? (
                <TouchableOpacity onPress={() => onPressEdit()}>
                  <Image source={Icons.eyeIn} style={styles.editIcon} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => onPressEdit()}>
                  <Image source={Icons.editItemIcon} style={styles.editIcon} />
                </TouchableOpacity>
              )}
              <Spacer width={8} />
              <TouchableOpacity onPress={() => onPressDelete()}>
                <Image source={Icons.deleteItemIcon} style={styles.editIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{borderBottomColor: colors.image_bg, borderBottomWidth: 1}}
          />
        </View>
      </View>
    </View>
  );
};
export default CuisinesNameCardList;

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    boxView: {
      // marginTop: hp(20),
    },
    subBoxView: {
      flexDirection: 'row',
    },
    container: {
      flex: 1,
    },
    leftView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: hp(12),
    },
    imageStyle: {
      width: 16,
      height: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.text_gray,
      resizeMode: 'cover',
      marginRight: wp(8),
    },
    editIcon: {
      width: 16,
      height: 16,
      resizeMode: 'contain',
    },
    viewStyle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleText: {
      flex: 1,
      ...commonFontStyle(400, 14, colors.title_dec100),
    },
  });
};
