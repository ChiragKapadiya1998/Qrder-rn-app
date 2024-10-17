import Toast from 'react-native-toast-message';
import {navigationRef} from '../navigation/mainNavigator';
import Snackbar from 'react-native-snackbar';
import {strings} from '../i18n/i18n';
import moment from 'moment';

export const emailCheck = (email: string) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (reg.test(email) === false) {
    return false;
  } else {
    return true;
  }
};
export const numberCheck = (string: string) => {
  let reg = /^(?=.*[0-9]).+$/;
  return reg.test(string);
};

export const specialCarCheck = (string: string) => {
  let reg = /^(?=.*[!@#$%^&*()]).+$/;
  return reg.test(string);
};

export const UpperCaseCheck = (string: string) => {
  let reg = /^(?=.*[A-Z]).+$/;
  return reg.test(string);
};

export const nameCheck = (name: string) => {
  let reg = /^([a-zA-Z ]){2,30}$/;
  if (reg.test(name) === false) {
    return false;
  } else {
    return true;
  }
};

export const passwordCheck = (string: string) => {
  let reg = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  return reg.test(string);
};

export const resetNavigation = (name: string, params?: any) => {
  navigationRef.reset({
    index: 0,
    routes: [{name: name}],
  });
};

export const successToast = (message: string) => {
  Snackbar.show({
    text: message,
    duration: Snackbar.LENGTH_SHORT,
    backgroundColor: 'green',
  });
};

export const errorToast = (message: string) => {
  Snackbar.show({
    text: message,
    duration: Snackbar.LENGTH_SHORT,
    backgroundColor: '#FF0000',
  });
};

export const infoToast = (message: string) => {
  // Toast.show({type: 'info', text1: message});
  Snackbar.show({
    text: message,
    duration: Snackbar.LENGTH_SHORT,
    backgroundColor: '#000',
  });
};

export const DropDownData = [
  {
    name: strings('roleSelection.owner'),
    value: 'Admin',
    id: 1,
  },
  {
    name: strings('roleSelection.staff'),
    value: 'Staff',
    id: 2,
  },
  {
    name: strings('roleSelection.student'),
    value: 'Student',
    id: 2,
  },
];

export const DropDownDatas = [
  {
    name: 'Nirma University of Science and Technology',
    id: 1,
  },
  {
    name: 'Gujarat University',
    id: 2,
  },
  {
    name: 'Sardar Patel University',
    id: 3,
  },
  {
    name: 'Saurashtra University',
    id: 4,
  },
];

export const miscellData = [
  {id: '1', name: 'Cold Drink', price: 50},
  {id: '2', name: 'Hot Coffee', price: 70},
  {id: '3', name: 'Tea', price: 30},
  {id: '4', name: 'Milkshake', price: 100},
];


const getDayLabel = (dateString) => {
  const date = new Date(dateString.split('-').reverse().join('-')); // Convert 'DD-MM-YYYY' to 'YYYY-MM-DD'
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return days[date.getDay()]; // getDay() returns a number (0-6) where 0 is Sunday and 6 is Saturday
};


export const chartData = (revenueData, filter) => {
  switch (filter) {
    case strings('home.daily'):
      const label1 = ['Today'];
      const updateDaily = revenueData?.map((entry, index) => {
        return {
          value: parseFloat(entry?.revenue) || 0, // Parse revenue and default to 0 if NaN
          label: label1[index] || 'Unknown', // Use the corresponding label
        };
      });
      return updateDaily;
      break;
    case strings('home.week'):
      const labels2 = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      const updateWeekly = revenueData?.map((entry, index) => {
        return {
          value: parseFloat(entry?.revenue) || 0, // Parse revenue and default to 0 if NaN
          label: getDayLabel(entry?.date) || 'Unknown', // Use the corresponding label
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
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
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
  }
};

export const finedDate = filter => {
  console.log('filter', filter);

  const currentDate = moment();

  var start_date;
  var end_date;
  switch (filter) {
    case strings('home.daily'):
      start_date = currentDate.format('YYYY-MM-DD');
      end_date = currentDate.format('YYYY-MM-DD');
      break;
    case strings('home.week'):
      const startOfWeek = currentDate.clone().startOf('week'); // Start of the week (Sunday by default)
      const endOfWeek = currentDate.clone().endOf('week'); // End of the week (Saturday by default)
      start_date = startOfWeek.format('YYYY-MM-DD');
      end_date = endOfWeek.format('YYYY-MM-DD');
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

export const groupByMonth = data => {
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
