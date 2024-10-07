import { ThunkAction } from 'redux-thunk';
import { RootState } from '../redux/hooks';
import { AnyAction } from 'redux';
import { makeAPIRequest } from '../utils/apiGlobal';
import { GET, POST, api } from '../utils/apiConstants';
import {
  getAsyncToken,
  getAsyncUserInfo,
  setAsyncToken,
  setAsyncUserInfo,
} from '../utils/asyncStorageManager';
import { errorToast, successToast } from '../utils/commonFunction';

export const userLogin =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
      let headers = {
        'Content-Type': 'multipart/form-data',
      };
      return makeAPIRequest({
        method: POST,
        url: api.login,
        headers: headers,
        data: request.data,
      })
        .then(async (response: any) => {
          if (response?.data?.data) {
            await setAsyncToken(response?.data?.data?.token);
            await setAsyncUserInfo(response?.data?.data?.user);
            if (request.onSuccess) request.onSuccess(response.data);
          } else {
            if (request.onFailure) request.onFailure(response.data);
          }
        })
        .catch(error => {
          console.log('error?.response?.data', error?.response?.data);

          if (request.onFailure) request.onFailure(error?.response?.data);
        });
    };

export const userSignUp =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
      let headers = {
        'Content-Type': 'multipart/form-data',
      };
      return makeAPIRequest({
        method: POST,
        url: api.register,
        headers: headers,
        data: request.data,
      })
        .then(async (response: any) => {
          if (response.status === 200 || response.status === 201) {
            await setAsyncToken(response?.data?.data?.token);
            await setAsyncUserInfo(response?.data?.data?.user);
            if (request.onSuccess) request.onSuccess(response.data);
          }
        })
        .catch(error => {
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const studentUserSignUp =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
      let headers = {
        'Content-Type': 'multipart/form-data',
      };
      return makeAPIRequest({
        method: POST,
        url: api.studentRegister,
        headers: headers,
        data: request.data,
      })
        .then(async (response: any) => {
          if (response?.data?.success) {
            await setAsyncToken(response?.data?.data?.token);
            await setAsyncUserInfo(response?.data?.data?.user);
            if (request.onSuccess) request.onSuccess(response.data);
          } else {
            if (request.onFailure) request.onFailure(response.data);
          }
        })
        .catch(error => {
          if (request.onFailure) request.onFailure(error?.response?.data);
        });
    };

export const canteenRegisterSignUp =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
      let headers = {
        'Content-Type': 'multipart/form-data',
      };
      return makeAPIRequest({
        method: POST,
        url: api.canteenRegister,
        headers: headers,
        data: request.data,
      })
        .then(async (response: any) => {
          if (response?.data?.success) {
            await setAsyncToken(response?.data?.data?.token);
            await setAsyncUserInfo(response?.data?.data?.user);
            if (request.onSuccess) request.onSuccess(response.data);
          } else {
            if (request.onFailure) request.onFailure(response.data);
          }
        })
        .catch(error => {
          if (request.onFailure) request.onFailure(error?.response?.data);
        });
    };

export const sendForgotEmail =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
      let headers = {
        'Content-Type': 'application/json',
      };
      return makeAPIRequest({
        method: POST,
        url: api.forgotEmail,
        headers: headers,
        data: request.data,
      })
        .then(async (response: any) => {
          if (response?.data) {
            successToast(response?.data?.message);
            if (request.onSuccess) request.onSuccess(response.data);
          } else {
            if (request.onFailure) request.onFailure(response.data);
          }
        })
        .catch(error => {
          errorToast('User not found');
          if (request.onFailure) request.onFailure(error.response);
        });
    };
export const sendEmailOtp =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
      let headers = {
        'Content-Type': 'application/json',
      };
      return makeAPIRequest({
        method: POST,
        url: api.sendEmailOtp,
        headers: headers,
        data: request.data,
      })
        .then(async (response: any) => {
          if (response?.data?.success) {
            if (request.onSuccess) request.onSuccess(response.data);
            successToast(response?.data?.message);
          } else {
            if (request.onFailure) request.onFailure(response);
          }
        })
        .catch(error => {
          errorToast('User not found');
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const updatePassword =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
      let headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: await getAsyncToken(),
      };
      return makeAPIRequest({
        method: POST,
        url: api.updatePasswords,
        headers: headers,
        data: request.data,
      })
        .then(async (response: any) => {
          if (response?.data?.success) {
            if (request.onSuccess) request.onSuccess(response.data);
            successToast(response?.data?.message);
          } else {
            if (request.onFailure) request.onFailure(response);
          }
        })
        .catch(error => {
          errorToast('User not found');
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const googleEmailAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
      let headers = {
        'Content-Type': 'application/json',
      };
      return makeAPIRequest({
        method: POST,
        url: api.googleEmail,
        headers: headers,
        data: request.data,
      })
        .then(async (response: any) => {
          if (response?.data?.success === true) {
            await setAsyncToken(response?.data?.data?.token);
            await setAsyncUserInfo(response?.data?.data?.user);
            if (request.onSuccess) request.onSuccess(response?.data?.data?.user);
          } else {
            if (request.onFailure) request.onFailure(response.data);
          }
        })
        .catch(error => {
          errorToast('User not found');
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const updateProfile =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
      let headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: await getAsyncToken(),
      };
      return makeAPIRequest({
        method: POST,
        url: api.updateProfile,
        headers: headers,
        data: request.data,
      })
        .then(async (response: any) => {
          if (response?.data?.success) {
            successToast(response?.data?.message);
            await setAsyncUserInfo(response?.data?.data?.user);
            if (request.onSuccess) request.onSuccess(response.data);
          } else {
            if (request.onFailure) request.onFailure(response.data);
          }
        })
        .catch(error => {
          errorToast('User not found');
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const universityUpdateAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
      let headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: await getAsyncToken(),
      };
      return makeAPIRequest({
        method: POST,
        url: api.universityUpdate,
        headers: headers,
        data: request.data,
      })
        .then(async (response: any) => {
          if (response?.data?.message) {
            if (request.onSuccess) request.onSuccess(response.data);
          } else {
            if (request.onFailure) request.onFailure(response.data);
          }
        })
        .catch(error => {
          errorToast('User not found');
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const getUserAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
      let headers = {
        Authorization: await getAsyncToken(),
      };
      let userDetails = await getAsyncUserInfo();

      return makeAPIRequest({
        method: GET,
        url: `${api.getUser}/${userDetails?.id}`,
        headers: headers,
      })
        .then(async (response: any) => {
          console.log('getUserAction response?.data', response?.data?.data);
          if (response?.data?.success === true) {
            await setAsyncUserInfo(response?.data?.data);
            if (request.onSuccess) request.onSuccess(response?.data?.data);
          } else {
            if (request.onFailure) request.onFailure(response.data);
          }
        })
        .catch(error => {
          errorToast('User not found');
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const appleSigninAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
      let headers = {
        'Content-Type': 'application/json',
      };
      return makeAPIRequest({
        method: POST,
        url: api.googleEmail,
        headers: headers,
        data: request.data,
      })
        .then(async (response: any) => {
          if (response?.data?.success === true) {
            await setAsyncToken(response?.data?.data?.token);
            await setAsyncUserInfo(response?.data?.data?.user);
            if (request.onSuccess) request.onSuccess(response?.data?.data?.user);
          } else {
            if (request.onFailure) request.onFailure(response.data);
          }
        })
        .catch(error => {
          errorToast('User not found');
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const changePasswords =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
      let headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: await getAsyncToken(),
      };
      return makeAPIRequest({
        method: POST,
        url: api.changePassword,
        headers: headers,
        data: request.data,
      })
        .then(async (response: any) => {
          if (response?.data) {
            if (request.onSuccess) request.onSuccess(response.data);
            successToast(response?.data?.message);
          } else {
            if (request.onFailure) request.onFailure(error.response.data.message);
          }
        })
        .catch(error => {
          if (request.onFailure) request.onFailure(error.response.data);
        });
    };