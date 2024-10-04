import { Dimensions, Platform } from 'react-native';
import { navigationRef } from '../navigation/mainNavigator';
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import ImageCropPicker from 'react-native-image-crop-picker';
import { Icons } from './images';
import { strings } from '../i18n/i18n';

export const dispatchNavigation = (name: string) => {
  navigationRef.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{ name: name }],
    }),
  );
};

export const openImagePicker = ({ params, onSucess, onFail }: any) => {
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
  } catch (error) { }
};

export const options = [
  { label: strings('addFoodList.Inclusiveinvoice'), icon: Icons.ic_check },
  { label: strings('addFoodList.Exclusiveinvoice'), icon: Icons.ic_check },
];

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

export const formatDateToDDMMYYYY = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
