import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation, useTheme } from '@react-navigation/native';
import { strings } from '../../i18n/i18n';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import HomeHeader from '../../compoment/HomeHeader';
import { Icons } from '../../utils/images';
import HomeDropDown from '../../compoment/HomeDropDown';
import {
  getAllOrderAction,
  getAllOrderFilterAction,
} from '../../actions/allOrdersAction';
import { convertIsoToDate, formatDate, formatDateToDDMMYYYY } from '../../utils/globalFunctions';
import { getAsyncRole } from '../../utils/asyncStorageManager';
import DatePicker from 'react-native-date-picker';
import Spacer from '../../compoment/Spacer';
import NoDataFound from '../../compoment/NoDataFound';
import { screenName } from '../../navigation/screenNames';

const OrderHistory = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const { isDarkTheme } = useAppSelector(state => state.common);
  const { allOrderHistory } = useAppSelector(state => state.orders);
  const [isRole, setIsRole] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);

  useEffect(() => {
    getAllOrdersHistory();
    getUserInfo();
  }, []);

  const getAllOrdersHistory = () => {
    let obj = {
      onSuccess: () => { },
      onFailure: () => { },
    };
    dispatch(getAllOrderAction(obj));
  };
  console.log("----", isRole)
  const getAllOrdersFilter = data => {
    let obj = {
      params: {
        start_date: formatDateToDDMMYYYY(startDate),
        end_date: formatDateToDDMMYYYY(data),
      },
      onSuccess: () => { },
      onFailure: () => { },
    };
    dispatch(getAllOrderFilterAction(obj));
  };

  const getUserInfo = async () => {
    let isRole = await getAsyncRole();
    setIsRole(isRole);
  };

  const handleDatePickerOpen = isStartDate => {
    setIsSelectingStartDate(isStartDate);
    setIsDatePickerVisible(true);
  };

  const handleDateConfirm = selectedDate => {
    if (isSelectingStartDate) {
      setStartDate(selectedDate);
    } else {
      if (!startDate) {
        Alert.alert('error', strings('orderModal.e_start_data'), [
          {
            text: strings('orderModal.ok'),
            onPress: () => setIsDatePickerVisible(false),
          },
        ]);
        return;
      }

      setEndDate(selectedDate);
      getAllOrdersFilter(selectedDate);
    }
    setIsDatePickerVisible(false);
  };

  const onCancelBtn = () => { };

  const renderItem = ({ item, index }) => {
    const formattedDate = convertIsoToDate(item.created_at);
    return (
      <View style={styles.listContainer}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() =>
            {
              if (isRole === 'Staff') {
                navigation.navigate(screenName.ChefMyOrders, { itemData: item })
              } else {
                navigation.navigate(screenName.MyOrderAdmin, { itemData: item })
              }
            }
            }
            style={styles.imageView}>
            <Text style={styles.imageText}>#{index + 1}</Text>
          </TouchableOpacity>

          <View style={styles.rightContainer}>
            <Text numberOfLines={1} style={styles.breakText}>{`${strings(
              'orderModal.invoice_id',
            )} : ${item.order_id}`}</Text>
            <Text style={styles.titleStyle}>{item.name}</Text>
            {item.table_number !== null ? (
              <Text style={styles.idText}>{`${strings(
                'orderModal.table_no',
              )} : ${item.table_number}`}</Text>
            ) : null}
            <View style={styles.priceView}>
              <Text style={styles.priceText}>{`₹${item.total}`}</Text>
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.diningView}>
            <Text style={styles.diningText}>
              {item.order_type === 1
                ? strings('orderModal.dining')
                : strings('orderModal.parcel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={colors.white}
      />
      <HomeHeader
        onBackPress={() => navigation.goBack()}
        mainShow={true}
        onRightPress={() => {
          getAllOrdersHistory();
          setStartDate(null);
          setEndDate(null);
        }}
        title={strings('profileScreen.order_history')}
        isShowIcon={false}
        extraStyle={styles.headerContainer}
        isHideIcon={true}
        rightTextStyle={styles.rightTextStyle}
        isShowIcon={true}
        isHideIcon={true}
        rightText={
          strings('addFoodList.reset')
        }
      />
      <View style={styles.headerView}>
        {allOrderHistory?.length !== 0 && (
          <View style={styles.datePickerContainer}>
            <TouchableOpacity
              onPress={() => handleDatePickerOpen(true)}
              style={styles.dateButton}>
              <Text style={styles.dateText}>
                {startDate
                  ? `${formatDateToDDMMYYYY(startDate)}`
                  : strings('orderModal.start_date')}
              </Text>
            </TouchableOpacity>
            <Spacer width={5} />
            <TouchableOpacity
              onPress={() => handleDatePickerOpen(false)}
              style={styles.dateButton}>
              <Text style={styles.dateText}>
                {endDate
                  ? `${formatDateToDDMMYYYY(endDate)}`
                  : strings('orderModal.end_date')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={allOrderHistory}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<NoDataFound />}
          ListFooterComponent={() => {
            return <View style={{ height: 100 }} />;
          }}
        />
      </View>
      <Modal
        transparent={true}
        visible={isDatePickerVisible}
        animationType="slide">
        <View style={styles.modalContainer}>
          <DatePicker
            modal
            open={isDatePickerVisible}
            date={
              isSelectingStartDate
                ? startDate || new Date()
                : endDate || new Date()
            }
            onConfirm={handleDateConfirm}
            onCancel={() => setIsDatePickerVisible(false)}
            mode="date"
          />
        </View>
      </Modal>
    </View>
  );
};

const getGlobalStyles = (props: any) => {
  const { colors } = props;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg_white,
    },
    headerContainer: {
      backgroundColor: colors.white,
      paddingBottom: hp(0),
    },
    rightTextStyle: {
      textDecorationLine: 'underline',
      textTransform: 'uppercase',
    },
    headerView: {
      paddingHorizontal: wp(20),
    },
    listContainer: {
      marginTop: hp(8),
      backgroundColor: colors.cards_bg,
      paddingVertical: hp(16),
      paddingHorizontal: wp(16),
      borderRadius: 16,
    },
    imageView: {
      width: wp(70),
      height: hp(70),
      borderRadius: 16,
      backgroundColor: colors.image_bg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageText: {
      ...commonFontStyle(700, 24, colors.black),
    },
    rightContainer: {
      marginLeft: wp(10),
      flex: 1,
    },
    breakText: {
      ...commonFontStyle(400, 10, colors.text_orange),
    },
    titleStyle: {
      ...commonFontStyle(600, 14, colors.black),
    },
    idText: {
      marginTop: hp(2),
      ...commonFontStyle(400, 12, colors.title_dec),
    },
    priceView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    priceText: {
      ...commonFontStyle(600, 16, colors.text_orange),
    },
    dateText: {
      ...commonFontStyle(500, 14, colors.text_gray),
    },
    btnContainer: {},
    cancelBtn: {
      flex: 1,
      height: hp(42),
      marginTop: hp(16),
      backgroundColor: colors.btn_bg,
      borderColor: colors.border_gray,
      borderWidth: 1,
      borderRadius: wp(42),
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    cancelText: {
      ...commonFontStyle(600, 12, colors.black),
      textTransform: 'none',
    },
    diningView: {
      position: 'absolute',
      top: -2,
      right: 0,
      backgroundColor: colors.text_orange,
      paddingHorizontal: wp(6),
      paddingVertical: hp(2),
      borderRadius: 16,
    },
    diningText: {
      ...commonFontStyle(500, 10, colors.defult_white),
    },
    invoiveIcon: {
      width: wp(18),
      height: hp(18),
      resizeMode: 'contain',
      marginRight: wp(8),
    },
    datePickerContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: hp(10),
      marginBottom: hp(5),
    },
    dateButton: {
      backgroundColor: colors.cards_bg,
      paddingVertical: hp(6),
      paddingHorizontal: wp(10),
      borderRadius: 8,
    },
    dateText: {
      ...commonFontStyle(400, 12, colors.black),
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    listContainer: {
      marginTop: hp(8),
      backgroundColor: colors.cards_bg,
      paddingVertical: hp(16),
      paddingHorizontal: wp(16),
      borderRadius: 16,
    },
  });
};

export default OrderHistory;
