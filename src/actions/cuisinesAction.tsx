import {ThunkAction} from 'redux-thunk';
import {RootState} from '../redux/hooks';
import {AnyAction} from 'redux';
import {makeAPIRequest} from '../utils/apiGlobal';
import {DELETE, GET, POST, PUT, api} from '../utils/apiConstants';
import {
  DELETE_CUISINES_DATA,
  GET_CITY_DATA,
  GET_CUISINES_DATA,
  GET_MENU_MASTERS,
  GET_MISCELLANEOUS,
  GET_RECIPES_MASTERS,
  GET_RECIPES_MENU,
  IS_LOADING,
  IS_LOADING_NEW,
  USER_INFO,
} from '../redux/actionTypes';
import {getAsyncToken} from '../utils/asyncStorageManager';

export const getCuisinesAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };
    dispatch({type: IS_LOADING, payload: true});
    return makeAPIRequest({
      method: GET,
      url: api.getCuisines,
      headers: headers,
      params: request.data,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          // dispatch({type: GET_CUISINES_DATA, payload: response?.data?.data});
          dispatch({
            type: GET_CUISINES_DATA,
            payload: {
              ...response?.data?.data,
              current_page: request?.data?.page,
            },
          });
          dispatch({type: IS_LOADING, payload: false});
          if (request.onSuccess) request.onSuccess(response.data.data);
        }
      })
      .catch(error => {
        console.log('====================================');
        console.log('error', error);
        console.log('====================================');
        dispatch({type: IS_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const addCuisinesAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
      'Content-Type': 'multipart/form-data',
    };
    dispatch({type: IS_LOADING, payload: true});
    dispatch({type: IS_LOADING_NEW, payload: true});
    return makeAPIRequest({
      method: POST,
      url: api.getCuisines,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response?.data?.success) {
          dispatch({type: IS_LOADING, payload: false});
          dispatch({type: IS_LOADING_NEW, payload: false});
          if (request.onSuccess) request.onSuccess(response.data);
        } else {
          dispatch({type: IS_LOADING_NEW, payload: false});

          if (request.onFailure) request.onFailure(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        dispatch({type: IS_LOADING_NEW, payload: false});
        if (request.onFailure) request.onFailure(error?.response?.data);
      });
  };

export const editCuisinesAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
      'Content-Type': 'multipart/form-data',
    };
    dispatch({type: IS_LOADING_NEW, payload: true});

    dispatch({type: IS_LOADING, payload: true});
    return makeAPIRequest({
      method: POST,
      url: `${api.getCuisinesUpdate}/${request?.id}`,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response?.data?.success) {
          dispatch({type: IS_LOADING_NEW, payload: true});

          dispatch({type: IS_LOADING, payload: false});
          if (request.onSuccess) request.onSuccess(response.data);
        } else {
          dispatch({type: IS_LOADING_NEW, payload: true});

          if (request.onFailure) request.onFailure(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING_NEW, payload: false});
        dispatch({type: IS_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error?.response?.data);
      });
  };

export const deleteCuisinesAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };
    dispatch({type: IS_LOADING, payload: true});
    console.log('request.data', request.data);

    return makeAPIRequest({
      method: DELETE,
      url: `${api.getCuisines}/${request.data}`,
      headers: headers,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({type: DELETE_CUISINES_DATA, payload: request.data});
          dispatch({type: IS_LOADING, payload: false});
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const addMiscellaneousAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
      'Content-Type': 'multipart/form-data',
    };
    dispatch({type: IS_LOADING, payload: true});
    dispatch({type: IS_LOADING_NEW, payload: true});
    return makeAPIRequest({
      method: POST,
      url: api.getmiscellaneous,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        console.log('response?.data', response?.data);
        if (response?.data?.success) {
          dispatch({type: IS_LOADING, payload: false});
          dispatch({type: IS_LOADING_NEW, payload: false});
          if (request.onSuccess) request.onSuccess(response.data);
        } else {
          dispatch({type: IS_LOADING_NEW, payload: false});
          if (request.onFailure) request.onFailure(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        dispatch({type: IS_LOADING_NEW, payload: false});
        if (request.onFailure) request.onFailure(error?.response?.data);
      });
  };

export const deleteMiscellaneousAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };
    dispatch({type: IS_LOADING, payload: true});
    console.log('request.data', request.data);

    return makeAPIRequest({
      method: DELETE,
      url: `${api.getmiscellaneous}/${request.data}`,
      headers: headers,
    })
      .then(async (response: any) => {
        if (response?.data?.message) {
          dispatch({type: IS_LOADING, payload: false});
          if (request.onSuccess) request.onSuccess(response.data);
        } else {
          if (request.onFailure) request.onFailure(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const editMiscellaneousAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };
    dispatch({type: IS_LOADING, payload: true});
    dispatch({type: IS_LOADING_NEW, payload: true});
    return makeAPIRequest({
      method: PUT,
      url: `${api.getmiscellaneous}/${request.id}`,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        console.log('response?.data', response?.data);
        if (response?.data?.success) {
          dispatch({type: IS_LOADING, payload: false});
          dispatch({type: IS_LOADING_NEW, payload: false});
          if (request.onSuccess) request.onSuccess(response.data);
        } else {
          dispatch({type: IS_LOADING_NEW, payload: false});
          if (request.onFailure) request.onFailure(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        dispatch({type: IS_LOADING_NEW, payload: false});
        if (request.onFailure) request.onFailure(error?.response?.data);
      });
  };

export const getMenuMastersAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };

    return makeAPIRequest({
      method: GET,
      url: `${api.menuMasters}`,
      headers: headers,
      params: request?.data,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({
            type: GET_MENU_MASTERS,
            payload: response?.data?.data,
          });
          if (request.onSuccess) request.onSuccess(response?.data?.data);
        }
      })
      .catch(error => {
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const addMenuMastersAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };
    dispatch({type: IS_LOADING, payload: true});
    dispatch({type: IS_LOADING_NEW, payload: true});
    return makeAPIRequest({
      method: POST,
      url: api.menuMasters,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        console.log('response?.data', response?.data);
        if (response?.data?.success) {
          dispatch({type: IS_LOADING, payload: false});
          dispatch({type: IS_LOADING_NEW, payload: false});
          if (request.onSuccess) request.onSuccess(response.data);
        } else {
          dispatch({type: IS_LOADING_NEW, payload: false});
          if (request.onFailure) request.onFailure(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        dispatch({type: IS_LOADING_NEW, payload: false});
        if (request.onFailure) request.onFailure(error?.response?.data);
      });
  };

export const editMenuMastersAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };
    dispatch({type: IS_LOADING, payload: true});
    dispatch({type: IS_LOADING_NEW, payload: true});
    return makeAPIRequest({
      method: PUT,
      url: `${api.menuMasters}/${request.id}`,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        console.log('response?.data', response?.data);
        if (response?.data?.success) {
          dispatch({type: IS_LOADING, payload: false});
          dispatch({type: IS_LOADING_NEW, payload: false});
          if (request.onSuccess) request.onSuccess(response.data);
        } else {
          dispatch({type: IS_LOADING_NEW, payload: false});
          if (request.onFailure) request.onFailure(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        dispatch({type: IS_LOADING_NEW, payload: false});
        if (request.onFailure) request.onFailure(error?.response?.data);
      });
  };

export const deleteMenuMastersAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };
    dispatch({type: IS_LOADING, payload: true});
    console.log('request.data', request.data);

    return makeAPIRequest({
      method: DELETE,
      url: `${api.menuMasters}/${request.id}`,
      headers: headers,
    })
      .then(async (response: any) => {
        console.log('response?.data?.message', response?.data?.message);

        if (response?.data?.message) {
          dispatch({type: IS_LOADING, payload: false});
          if (request.onSuccess) request.onSuccess(response.data);
        } else {
          if (request.onFailure) request.onFailure(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error.response);
      });
  };

//recipes

export const getRecipeMasterAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };

    return makeAPIRequest({
      method: GET,
      url: `${api.recipeMaster}`,
      headers: headers,
      params: request?.data,
    })
      .then(async (response: any) => {
        console.log('response', response);
        if (response.status === 200 || response.status === 201) {
          dispatch({
            type: GET_RECIPES_MASTERS,
            payload: response?.data,
          });
          if (request.onSuccess) request.onSuccess(response?.data);
        }
      })
      .catch(error => {
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const addRecipeMasterAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };
    dispatch({type: IS_LOADING, payload: true});
    dispatch({type: IS_LOADING_NEW, payload: true});
    return makeAPIRequest({
      method: POST,
      url: api.recipeMaster,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        console.log('response?.data', response?.data);
        if (response?.data?.success) {
          dispatch({type: IS_LOADING, payload: false});
          dispatch({type: IS_LOADING_NEW, payload: false});
          if (request.onSuccess) request.onSuccess(response.data);
        } else {
          dispatch({type: IS_LOADING_NEW, payload: false});
          if (request.onFailure) request.onFailure(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        dispatch({type: IS_LOADING_NEW, payload: false});
        if (request.onFailure) request.onFailure(error?.response?.data);
      });
  };

export const editRecipeMastersAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };
    dispatch({type: IS_LOADING, payload: true});
    dispatch({type: IS_LOADING_NEW, payload: true});
    return makeAPIRequest({
      method: PUT,
      url: `${api.recipeMaster}/${request.data?.menu_id}`,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        console.log('response?.data', response?.data);
        if (response?.data?.success) {
          dispatch({type: IS_LOADING, payload: false});
          dispatch({type: IS_LOADING_NEW, payload: false});
          if (request.onSuccess) request.onSuccess(response.data);
        } else {
          dispatch({type: IS_LOADING_NEW, payload: false});
          if (request.onFailure) request.onFailure(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        dispatch({type: IS_LOADING_NEW, payload: false});
        if (request.onFailure) request.onFailure(error?.response?.data);
      });
  };

export const deleteRecipeMasterAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };
    dispatch({type: IS_LOADING, payload: true});
    console.log('request.data', request.data);

    return makeAPIRequest({
      method: DELETE,
      url: `${api.recipeMaster}/${request.id}`,
      headers: headers,
    })
      .then(async (response: any) => {
        console.log('response?.data?.message', response?.data?.message);

        if (response?.data?.message) {
          dispatch({type: IS_LOADING, payload: false});
          if (request.onSuccess) request.onSuccess(response.data);
        } else {
          if (request.onFailure) request.onFailure(response.data);
        }
      })
      .catch(error => {
        dispatch({type: IS_LOADING, payload: false});
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const getRecipeMenusAction =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    let headers = {
      Authorization: await getAsyncToken(),
    };

    return makeAPIRequest({
      method: GET,
      url: `${api.recipeMenu}`,
      headers: headers,
      params: request?.data,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          console.log(
            'response?.data?.dataresponse?.data?.data',
            response?.data?.data,
          );

          dispatch({
            type: GET_RECIPES_MENU,
            payload: response?.data,
          });
          if (request.onSuccess) request.onSuccess(response?.data?.data);
        }
      })
      .catch(error => {
        if (request.onFailure) request.onFailure(error.response);
      });
  };
