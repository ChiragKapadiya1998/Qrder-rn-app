import {Alert, Dimensions, Platform} from 'react-native';
import {navigationRef} from '../navigation/mainNavigator';
import {CommonActions} from '@react-navigation/native';
import moment from 'moment';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Icons} from './images';
import {strings} from '../i18n/i18n';
import {getUniqueId} from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {asyncKeys} from './asyncStorageManager';
import appleAuth from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import {errorToast, infoToast} from './commonFunction';

export const dispatchNavigation = (name: string) => {
  navigationRef.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{name: name}],
    }),
  );
};

export const openImagePicker = ({params, onSucess, onFail}: any) => {
  try {
    ImageCropPicker.openPicker({
      multiple: false,
      cropping: true,
      mediaType: 'photo',
      ...params,
    })
      .then(image => {
        let obj = {
          ...image,
          uri: image.path,
          name: 'image_' + moment().unix() + '_' + image.path.split('/').pop(),
        };
        onSucess(obj);
      })
      .catch(err => {
        onFail?.(err);
      });
  } catch (error) {}
};

export const options = [
  {label: strings('addFoodList.Inclusiveinvoice'), icon: Icons.ic_check},
  {label: strings('addFoodList.Exclusiveinvoice'), icon: Icons.ic_check},
];

export const formatDate = dateString => {
  const date = new Date(dateString);
  const options = {day: 'numeric', month: 'long', year: 'numeric'};
  return date.toLocaleDateString('en-GB', options);
};
export const convertIsoToDate = isoString => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateToDDMMYYYY = date => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formDataAppleLogin = async (response: any) => {
  let deviceToken = await AsyncStorage.getItem(asyncKeys.fcm_token);
  let uniqueId = await getUniqueId();
  var str = response.user.email;
  str = str?.split('@');
  let data = new FormData();
  data.append('name', str?.[0]);
  data.append('email', response.user.email);
  data.append('id', response.user.uid);
  data.append('role', 'student');
  data.append('device_token', JSON.parse(deviceToken) || uniqueId);
  return data;
};

export async function onAppleLogin() {
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  if (!appleAuthRequestResponse.identityToken) {
    infoToast('Apple Sign-In failed - no identify token returned');
    throw 'Apple Sign-In failed - no identify token returned';
  }

  const {identityToken, nonce} = appleAuthRequestResponse;
  const appleCredential = auth.AppleAuthProvider.credential(
    identityToken,
    nonce,
  );

  return auth().signInWithCredential(appleCredential);
}

export const calculateTotalMiscAmount = items => {
  if (items && items.length > 0) {
    return items
      .reduce((total, item) => {
        const itemTotal = item.miscellaneous_items
          ? item.miscellaneous_items.reduce(
              (sum, misc) => sum + parseFloat(misc.price || 0),
              0,
            )
          : 0;
        return total + itemTotal;
      }, 0)
      .toFixed(2);
  }
  return 0;
};

export const calculateTotalTax = items => {
  if (!Array.isArray(items) || items.length === 0) {
    return '0.00';
  }

  return items
    .reduce((totalTax, item) => {
      const taxForItem = item?.menu?.price * (item?.menu?.tax_percentage / 100);
      return totalTax + (taxForItem || 0);
    }, 0)
    .toFixed(2);
};
