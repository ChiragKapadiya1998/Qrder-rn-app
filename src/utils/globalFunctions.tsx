import {Dimensions, Platform} from 'react-native';
import {navigationRef} from '../navigation/mainNavigator';
import {CommonActions} from '@react-navigation/native';
import moment from 'moment';
import ImageCropPicker from 'react-native-image-crop-picker';

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
