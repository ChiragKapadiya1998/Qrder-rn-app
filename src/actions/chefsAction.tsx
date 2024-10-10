import { ThunkAction } from 'redux-thunk';
import { RootState } from '../redux/hooks';
import { AnyAction } from 'redux';
import { makeAPIRequest } from '../utils/apiGlobal';
import { DELETE, GET, PATCH, POST, PUT, api } from '../utils/apiConstants';
import {
  DELETE_CHEF_DATA,
  GET_CHEFS_DATA,
  GET_CITY_DATA,
  GET_CUISINES_DATA,
  IS_LOADING,
  IS_LOADING_NEW,
  USER_INFO,
} from '../redux/actionTypes';
import { getAsyncToken } from '../utils/asyncStorageManager';
import { successToast } from '../utils/commonFunction';

export const getChefsAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
      let headers = {
        Authorization: await getAsyncToken(),
      };
      return makeAPIRequest({
        method: GET,
        url: api.getChefs,
        headers: headers,
        params: request.data
      })
        .then(async (response: any) => {
          if (response.status === 200 || response.status === 201) {
            dispatch({ type: GET_CHEFS_DATA, payload: response?.data?.data?.data });
            if (request.onSuccess) request.onSuccess(response.data);
          }
        })
        .catch(error => {
          if (request.onFailure) request.onFailure(error.response);
        });
    };

export const chefsSignUp =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
      let headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: await getAsyncToken(),
      };
      dispatch({ type: IS_LOADING_NEW, payload: true });
      return makeAPIRequest({
        method: POST,
        url: api.chefsRegister,
        headers: headers,
        data: request.data,
      })
        .then(async (response: any) => {
          if (response?.data?.success) {
            dispatch({ type: IS_LOADING_NEW, payload: false });
            successToast(response?.data?.message)
            if (request.onSuccess) request.onSuccess(response.data);
          } else {
            dispatch({ type: IS_LOADING_NEW, payload: false });
            if (request.onFailure) request.onFailure(response.data);
          }
        })
        .catch(error => {
          dispatch({ type: IS_LOADING_NEW, payload: false });
          if (request.onFailure) request.onFailure(error?.response?.data);
        });
    };
export const chefsNameEdit =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
      let headers = {
        Authorization: await getAsyncToken(),
        'Content-Type': 'multipart/form-data',
      };
      dispatch({ type: IS_LOADING_NEW, payload: true });
      return makeAPIRequest({
        method: POST,
        url: `${api.updateChef}/${request?.id}`,
        headers: headers,
        data: request.data,
      })
        .then(async (response: any) => {
          if (response?.data?.success) {
            dispatch({ type: IS_LOADING_NEW, payload: false });
            successToast(response?.data?.message)
            if (request.onSuccess) request.onSuccess(response.data);
          } else {
            dispatch({ type: IS_LOADING_NEW, payload: false });
            if (request.onFailure) request.onFailure(response.data);
          }
        })
        .catch(error => {
          dispatch({ type: IS_LOADING_NEW, payload: false });
          if (request.onFailure) request.onFailure(error?.response?.data);
        });
    };

export const deleteChefAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
      let headers = {
        Authorization: await getAsyncToken(),
      };
      dispatch({type: IS_LOADING_NEW, payload: true});
      return makeAPIRequest({
        method: DELETE,
        url: `${api.chefsRegister}/${request.params}`,
        headers: headers,
      })
        .then(async (response: any) => {
          if (response.status === 200 || response.status === 201) {
            dispatch({ type: IS_LOADING_NEW, payload: false });
            dispatch({ type: DELETE_CHEF_DATA, payload: request.params });
            if (request.onSuccess) request.onSuccess(response.data);
          }
        })
        .catch(error => {
          dispatch({ type: IS_LOADING_NEW, payload: false });
          if (request.onFailure) request.onFailure(error.response);
        });
    };
