import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from './apiConstants';
import {clearAsync} from './asyncStorageManager';
import {navigationRef} from '../navigation/mainNavigator';
import {screenName} from '../navigation/screenNames';

interface makeAPIRequestProps {
  method?: any;
  url?: any;
  data?: any;
  headers?: any;
  params?: any;
  isBaseUrl?: any;
}

export const makeAPIRequest = ({
  method,
  url,
  data,
  headers,
  params,
  isBaseUrl,
}: makeAPIRequestProps) =>
  new Promise((resolve, reject) => {
    const option = {
      method,
      baseURL: isBaseUrl ? api.BASE_URL1 : api.BASE_URL,
      url,
      data,
      headers,
      params,
    };
    console.log('option', option);

    axios(option)
      .then(response => {
        // console.log("response-->", response);
        console.log('error?.response?', response);
        if (response.status === 200 || response.status === 201) {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch(error => {
        console.log('error?.response?', error.response);
        if (error?.response?.status === 401) {
          clearAsync();
          // errorToast(error?.response?.data?.message);
          navigationRef?.current?.reset({
            index: 1,
            routes: [{name: screenName.LoginSignupScreen}],
          });
        } else {
          // infoToast("Something went wrong, please try again.");
        }
        reject(error);
      });
  });
