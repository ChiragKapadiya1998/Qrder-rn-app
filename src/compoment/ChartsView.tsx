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
// import {chartData, finedDate, groupByMonth} from '../utils/commonFunction';
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
  const {isDarkTheme, isLanguage} = useAppSelector(state => state.common);

  const [selectedType, setselectedType] = useState({
    lable: '24 h',
    isSelected: true,
    data: ptData,
  });

  useEffect(() => {
    setdropDownValue(strings('home.daily'));
  }, [isLanguage]);

  const getDayLabel = dateString => {
    const date = new Date(dateString.split('-').reverse().join('-')); // Convert 'DD-MM-YYYY' to 'YYYY-MM-DD'
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return days[date.getDay()]; // getDay() returns a number (0-6) where 0 is Sunday and 6 is Saturday
  };

  const chartData = (revenueData, filter) => {
    switch (filter) {
      case strings('home.daily'):
        const label1 = [`${strings('newKey.today')}`];
        const updateDaily = revenueData?.map((entry, index) => {
          return {
            value: parseFloat(entry?.revenue) || 0, // Parse revenue and default to 0 if NaN
            label: label1[index] || 'Unknown', // Use the corresponding label
          };
        });
        return updateDaily;
        break;
      case strings('home.week'):
        const labels2 = [
          `${strings('newKey.M')}`,
          `${strings('newKey.T')}`,
          `${strings('newKey.W')}`,
          `${strings('newKey.T')}`,
          `${strings('newKey.F')}`,
          `${strings('newKey.St')}`,
          `${strings('newKey.S')}`,
        ];
        console.log('revenueData', revenueData);

        const updateWeekly = revenueData?.map((entry, index) => {
          return {
            value: parseFloat(entry?.revenue) || 0, // Parse revenue and default to 0 if NaN
            label: labels2[index] || 'Unknown', // Use the corresponding label
          };
        });
        return updateWeekly;
        break;
      case strings('home.monthly'):
        const labels3 = Array.from(
          {
            length: 31,
          },
          (_, i) => i + 1,
        );
        const updateMonthly = revenueData?.map((entry, index) => {
          return {
            value: parseFloat(entry?.revenue) || 0, // Parse revenue and default to 0 if NaN
            label: labels3[index] || 'Unknown', // Use the corresponding label
          };
        });
        return updateMonthly;
        break;
      case strings('home.yearly'):
        const labels4 = [
          `${strings('newKey.Jan')}`,
          `${strings('newKey.Feb')}`,
          `${strings('newKey.Mar')}`,
          `${strings('newKey.Apr')}`,
          `${strings('newKey.May')}`,
          `${strings('newKey.Jun')}`,
          `${strings('newKey.Jul')}`,
          `${strings('newKey.Aug')}`,
          `${strings('newKey.Sept')}`,
          `${strings('newKey.Oct')}`,
          `${strings('newKey.Nov')}`,
          `${strings('newKey.Dec')}`,
        ];

        const output = groupByMonth(revenueData);
        const updateYearly = Object.values(output)
          .map(item => item)
          ?.map((entry, index) => {
            return {
              value: parseFloat(entry?.revenue) || 0, // Parse revenue and default to 0 if NaN
              label: labels4[index] || 'Unknown', // Use the corresponding label
            };
          });
        return updateYearly;
        break;
      default:
        const label6 = ['Today'];
        const updateDaily3 = revenueData?.map((entry, index) => {
          return {
            value: parseFloat(entry?.revenue) || 0, // Parse revenue and default to 0 if NaN
            label: label6[index] || 'Unknown', // Use the corresponding label
          };
        });
        return updateDaily3;
        break;
    }
  };

  const finedDate = filter => {
    const currentDate = moment();

    var start_date;
    var end_date;
    switch (filter) {
      case strings('home.daily'):
        start_date = currentDate.format('YYYY-MM-DD');
        end_date = currentDate.format('YYYY-MM-DD');
        break;
      case strings('home.week'):
        const startOfWeek2 = moment().startOf('isoWeek');
        const endOfWeek2 = moment().endOf('isoWeek');
        // const startOfWeek = currentDate.clone().startOf('week'); // Start of the week (Sunday by default)
        // const endOfWeek = currentDate.clone().endOf('week'); // End of the week (Saturday by default)
        start_date = startOfWeek2.format('YYYY-MM-DD');
        end_date = endOfWeek2.format('YYYY-MM-DD');
        break;
      case strings('home.monthly'):
        const startOfMonth = currentDate.clone().startOf('month'); // First day of the month
        const endOfMonth = currentDate.clone().endOf('month');
        start_date = startOfMonth.format('YYYY-MM-DD');
        end_date = endOfMonth.format('YYYY-MM-DD');
        break;
      case strings('home.yearly'):
        const startOfYear = currentDate.clone().startOf('year');
        const endOfYear = currentDate.clone().endOf('year');
        start_date = startOfYear.format('YYYY-MM-DD');
        end_date = endOfYear.format('YYYY-MM-DD');
        break;
    }

    return {start_date, end_date};
  };

  function financial(x) {
    return Number.parseFloat(x).toFixed(0);
  }

  const groupByMonth = data => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Initialize an object to store revenue sums by month
    const result = {};

    data?.forEach(item => {
      // Convert the date string to a Date object
      const dateObj = new Date(item.date.split('-').reverse().join('-')); // Reverse to get YYYY-MM-DD
      const monthName = monthNames[dateObj.getMonth()]; // Get the month name

      // Initialize or accumulate the revenue for this month
      if (!result[monthName]) {
        result[monthName] = {
          date: monthName,
          revenue: 0,
        };
      }

      // Accumulate the revenue
      result[monthName].revenue += Number(financial(item.revenue));
    });

    return result;
  };

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
    console.log('params', obj.params);

    dispatch(getDashboardAction(obj));
  };

  const onChangeFilter = text => {
    setdropDownValue(text);
    getDashboard(finedDate(text));
  };

  console.log(
    'adfasdasdas',
    financial(getDashboardData?.total_revenue) == 0 ||
      getDashboardData?.data == 0 ||
      getDashboardData?.data == undefined,
  );
  console.log('adasdasdaddasda', getDashboardData?.data);

  console.log('adasdasdaddasda', dropDownValue);
  console.log(
    'adasdasdaddasdadasdasdasdadasd',
    chartData(getDashboardData?.data, dropDownValue),
  );

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
            yAxisTextStyle={{color: colors.text_orange}}
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
