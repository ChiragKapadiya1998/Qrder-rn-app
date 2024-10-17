import {
  ActivityIndicator,
  ImageBackground,
  ReturnKeyType,
  StyleSheet,
  Text,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation, useTheme} from '@react-navigation/native';
import {
  commonFontStyle,
  hp,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  wp,
} from '../theme/fonts';
import {Icons} from '../utils/images';
import HomeDropDown from './HomeDropDown';
import {BarChart, LineChart} from 'react-native-gifted-charts';
import {strings} from '../i18n/i18n';
import {screenName} from '../navigation/screenNames';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {getDashboardAction} from '../actions/menuAction';
import {chartData, finedDate, groupByMonth} from '../utils/commonFunction';
import moment from 'moment';

type Props = {
  placeholder: string;
  label: string;
  value: string;
  onChangeText: (params: string) => void;
  isShowEyeIcon?: boolean;
  secureTextEntry?: boolean;
  onPressEye?: () => void;
  onSubmitEditing?: () => void;
  theme?: string;
  autoCorrect?: boolean;
  rest?: TextInputProps[];
  inputRef?: any;
  returnKeyType?: ReturnKeyType;
};

const ptData = [
  {value: 500, label: '10am', frontColor: '#177AD5'},
  {value: 745, label: '11am', frontColor: '#177AD5'},
  {value: 320, label: '12pm'},
  {value: 600, label: '1pm', frontColor: '#177AD5'},
  {value: 256, label: '2pm'},
  {value: 300, label: '3pm'},
  {value: 300, label: '4pm'},
  {value: 300, label: '5pm'},
  {value: 300, label: '6pm'},
];

const ChartsView = ({
  placeholder,
  label,
  value,
  onChangeText,
  secureTextEntry,
  onPressEye,
  isShowEyeIcon,
  theme = 'first',
  autoCorrect,
  inputRef,
  returnKeyType,
  onSubmitEditing,
  ...rest
}: Props) => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const [dropDownValue, setdropDownValue] = useState(strings('home.daily'));
  const [pointerIndex, setpointerIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const {getDashboardData} = useAppSelector(state => state.data);
  const [convertedData, setConvertedData] = useState(getDashboardData?.data);
  const dispatch = useAppDispatch();

  const [selectedType, setselectedType] = useState({
    lable: '24 h',
    isSelected: true,
    data: ptData,
  });

  const isFocuse = useIsFocused();

  function financial(x) {
    return Number.parseFloat(x).toFixed(0);
  }

  useEffect(() => {
    getDashboard(finedDate(dropDownValue));
  }, []);

  const getDashboard = item => {
    setIsLoading(true);
    let obj = {
      params: {
        start_date: item?.start_date,
        end_date: item?.end_date,
      },
      onSuccess: (res: any) => {
        setIsLoading(false);
      },
      onFailure: (Err: any) => {
        setIsLoading(false);
      },
    };
    dispatch(getDashboardAction(obj));
  };

  const onChangeFilter = text => {
    setdropDownValue(text);
    getDashboard(finedDate(text));
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <View style={{marginRight: 10}}>
            <Text numberOfLines={1} style={styles.labelTextStyle}>
              {strings('home.total_revenue')}
            </Text>
            <Text numberOfLines={1} style={styles.labelTextStyle1}>
              {`₹${
                financial(getDashboardData?.total_revenue) !== 'NaN'
                  ? financial(getDashboardData?.total_revenue)
                  : 0
              }`}
            </Text>
          </View>
        </View>
        <HomeDropDown
          value={dropDownValue}
          onChangeText={(text: any) => {
            onChangeFilter(text);
          }}
        />
      </View>
      <View style={{left: -8, marginTop: 20}}>
        {isLoading ? (
          <View
            style={{
              height: SCREEN_HEIGHT * 0.18,
              alignItems: 'center',
            }}>
            <ActivityIndicator
              color={colors.Primary_Orange}
              size={'small'}
              style={{marginTop: SCREEN_HEIGHT * 0.05}}
            />
          </View>
        ) : financial(getDashboardData?.total_revenue) == 0 ||
          getDashboardData?.data == 0 ||
          getDashboardData?.data == undefined ? (
          <BarChart
            data={chartData(getDashboardData?.data, dropDownValue)}
            barWidth={30}
            maxValue={1}
            adjustToWidth={false}
            barBorderRadius={5}
            frontColor={colors.text_orange}
            yAxisTextStyle={{color: colors.black}}
            xAxisLabelTextStyle={{color: colors.black}}
            noOfSections={4} // Number of sections on the Y-axis
            yAxisLabelTexts={['0', '20K', '40K', '60K', '70K', '80K']}
            isAnimated
            width={SCREEN_WIDTH * 0.7}
            height={SCREEN_HEIGHT * 0.18}
            yAxisThickness={0}
            xAxisThickness={0}
          />
        ) : (
          <BarChart
            data={chartData(getDashboardData?.data, dropDownValue)}
            barWidth={30}
            adjustToWidth={false}
            barBorderRadius={5}
            frontColor={colors.text_orange}
            yAxisTextStyle={{color: colors.black}}
            xAxisLabelTextStyle={{color: colors.black}}
            noOfSections={4} // Number of sections on the Y-axis
            // yAxisLabelTexts={['0', '20K', '40K', '60K', '70K', '80K']}
            isAnimated
            width={SCREEN_WIDTH * 0.7}
            height={SCREEN_HEIGHT * 0.18}
            yAxisThickness={0}
            xAxisThickness={0}
          />
        )}
      </View>
    </View>
  );
};

export default ChartsView;

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    container: {
      padding: 16,
    },
    labelTextStyle: {
      ...commonFontStyle(400, 14, colors.Title_Text),
    },
    labelTextStyle1: {
      ...commonFontStyle(700, 22, colors.text_orange),
    },
    seeText: {
      ...commonFontStyle(400, 14, colors.Primary_Orange),
      textDecorationLine: 'underline',
    },
  });
};
