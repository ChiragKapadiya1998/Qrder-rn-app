import {ThunkAction} from 'redux-thunk';
import {RootState} from '../redux/hooks';
import {AnyAction} from 'redux';
import {makeAPIRequest} from '../utils/apiGlobal';
import {GET, POST, api} from '../utils/apiConstants';
import {
  DECREMENT,
  DECREMENT_ITEM,
  GET_CANTEEN_CUISINE_LIST,
  GET_CANTEEN_MENU_LIST,
  GET_CITY_DATA,
  GET_DISCOUNT,
  GET_SUPPORT_TYPE,
  GET_UNIVERSITIES_CANTEEN_LIST,
  GET_UNIVERSITIES_LIST,
  INCREMENT,
  INCREMENT_ITEM,
  IS_LOADING,
  SEARCH_CITY,
  SELECT_ROLE,
  USER_INFO,
} from '../redux/actionTypes';
import {
  getAsyncToken,
  setAsyncToken,
  setAsyncUserInfo,
} from '../utils/asyncStorageManager';
import {successToast} from '../utils/commonFunction';

export const getCityAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {};
    dispatch({type: IS_LOADING, payload: true});
    return makeAPIRequest({
      method: GET,
      url: api.get_cities,
      headers: headers,
      params: request.data,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({type: GET_CITY_DATA, payload: response?.data?.data});
          dispatch({type: IS_LOADING, payload: false});
          if (request.onSuccess) request.onSuccess(response.data?.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const getUniversitiesDataAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {};
    return makeAPIRequest({
      method: GET,
      url: api.universities,
      headers: headers,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({
            type: GET_UNIVERSITIES_LIST,
            payload: response?.data?.data,
          });
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const getUniversityDataAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {};
    return makeAPIRequest({
      method: GET,
      url: `${api.university}/${request.params}`,
      headers: headers,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({
            type: GET_UNIVERSITIES_CANTEEN_LIST,
            payload: response?.data?.data,
          });
          dispatch({type: IS_LOADING, payload: false});
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const userSignUp =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      'Content-Type': 'multipart/form-data',
    };
    dispatch({type: IS_LOADING, payload: true});
    return makeAPIRequest({
      method: POST,
      url: api.register,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({type: IS_LOADING, payload: false});
          await setAsyncToken(response?.data?.data?.token);
          await setAsyncUserInfo(response?.data?.data?.user);
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const searchCities =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      'Content-Type': 'multipart/form-data',
    };
    dispatch({type: IS_LOADING, payload: true});
    return makeAPIRequest({
      method: GET,
      url: `${api.search_cities}/${request.data}`,
      headers: headers,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({type: IS_LOADING, payload: false});
          dispatch({type: SEARCH_CITY, payload: response?.data});
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const selectRoleAction =
  (data: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  dispatch => {
    dispatch({
      type: SELECT_ROLE,
      payload: data,
    });
  };

export const increment =
  (id: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  dispatch => {
    dispatch({
      type: INCREMENT,
      payload: id,
    });
  };

export const decrement =
  (id: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  dispatch => {
    dispatch({
      type: DECREMENT,
      payload: id,
    });
  };

export const getCanteenMenuAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };
    dispatch({type: IS_LOADING, payload: true});
    return makeAPIRequest({
      method: GET,
      url: `${api.cuisineMenu}/${request.id}`,
      headers: headers,
      params: request?.data,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          // dispatch({ type: GET_CANTEEN_MENU_LIST, payload: response?.data?.data });
          let Data = {
            ...response?.data?.data,
            current_page: request?.data?.page,
          };
          dispatch({type: GET_CANTEEN_MENU_LIST, payload: Data});
          dispatch({type: IS_LOADING, payload: false});
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error.response);
      });
  };
export const getCanteenCuisineAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };
    dispatch({type: IS_LOADING, payload: true});
    return makeAPIRequest({
      method: GET,
      url: `${api.canteenCuisine}/${request.params}`,
      headers: headers,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({
            type: GET_CANTEEN_CUISINE_LIST,
            payload: response?.data?.data,
          });
          dispatch({type: IS_LOADING, payload: false});
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error.response);
      });
  };
export const getStudentMenuListAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };
    dispatch({type: IS_LOADING, payload: true});
    return makeAPIRequest({
      method: GET,
      url: `${api.getStudentMenu}/${request.id}`,
      headers: headers,
      params: request?.data,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          // dispatch({ type: GET_CANTEEN_MENU_LIST, payload: response?.data?.data });
          dispatch({
            type: GET_CANTEEN_MENU_LIST,
            payload: {
              ...response?.data?.data,
              current_page: request?.data?.page,
            },
          });
          dispatch({type: IS_LOADING, payload: false});
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const addDiscountAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: await getAsyncToken(),
    };
    return makeAPIRequest({
      method: POST,
      url: api.updateDiscount,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response?.data?.success === true) {
          successToast(response?.data?.message);
          if (request.onSuccess) request.onSuccess(response.data);
        } else {
          if (request.onFailure) request.onFailure(response.data);
        }
      })
      .catch(error => {
        if (request.onFailure) request.onFailure(error?.response?.data);
      });
  };

export const getDiscountAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };
    return makeAPIRequest({
      method: GET,
      url: api.getDiscount,
      headers: headers,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({type: GET_DISCOUNT, payload: response?.data?.discount});
          if (request.onSuccess) request.onSuccess(response.data?.discount);
        }
      })
      .catch(error => {
        if (request.onFailure) request.onFailure(error.response);
      });
  };
export const waterBottleAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };
    return makeAPIRequest({
      method: POST,
      url: api.waterBottle,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response?.data?.message) {
          successToast(response?.data?.message);
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch(error => {
        if (request.onFailure) request.onFailure(error?.response?.data);
      });
  };
export const getSupportAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };
    return makeAPIRequest({
      method: GET,
      url: api.getSupportType,
      headers: headers,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({type: GET_SUPPORT_TYPE, payload: response?.data?.data});
          if (request.onSuccess) request.onSuccess(response.data?.data);
        }
      })
      .catch(error => {
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const addSupportDetails =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: await getAsyncToken(),
    };
    return makeAPIRequest({
      method: POST,
      url: api.addSupport,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response?.data?.success === true) {
          successToast(response?.data?.message);
          if (request.onSuccess) request.onSuccess(response.data);
        } else {
          if (request.onFailure) request.onFailure(response.data);
        }
      })
      .catch(error => {
        if (request.onFailure) request.onFailure(error?.response?.data);
      });
  };

export const getRestaurantDiscountAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
      'Content-Type': 'multipart/form-data',
    };
    return makeAPIRequest({
      method: POST,
      url: api.restaurantDiscount,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        console.log(
          'getRestaurantDiscountAction response?.data',
          response?.data,
        );
        if (response.status === 200 || response.status === 201) {
          dispatch({type: GET_DISCOUNT, payload: response?.data?.discount});
          if (request.onSuccess) request.onSuccess(response.data?.discount);
        }
      })
      .catch(error => {
        console.log('getRestaurantDiscountAction error', error.response);
        if (request.onFailure) request.onFailure(error.response);
      });
  };
