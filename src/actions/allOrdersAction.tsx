import { ThunkAction } from 'redux-thunk';
import { RootState } from '../redux/hooks';
import { AnyAction } from 'redux';
import { makeAPIRequest } from '../utils/apiGlobal';
import { DELETE, GET, POST, PUT, api } from '../utils/apiConstants';
import { successToast } from '../utils/commonFunction';
import { getAsyncToken } from '../utils/asyncStorageManager';
import { ACCPET_ORDER_REQUESTS, GET_ALL_MY_ORDER, GET_ALL_ORDER, GET_ALL_STUDENT_ORDER, GET_ORDER_REQUESTS, GET_RUNNING_ORDERS, ORDER_DECLINED, RUNNING_ORDER_COMPLETED } from '../redux/actionTypes';

export const getRunningOrderAction =
    (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
        async dispatch => {
            let headers = {
                Authorization: await getAsyncToken(),
            };
            return makeAPIRequest({
                method: GET,
                url: api.getRunningOrders,
                headers: headers,
            })
                .then(async (response: any) => {
                    if (response.status === 200 || response.status === 201) {
                        dispatch({ type: GET_RUNNING_ORDERS, payload: response?.data?.data });
                        if (request.onSuccess) request.onSuccess(response.data?.data);
                    }
                })
                .catch(error => {
                    if (request.onFailure) request.onFailure(error.response);
                });
        };

export const getOrdersRequestAction =
    (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
        async dispatch => {
            let headers = {
                Authorization: await getAsyncToken(),
            };
            return makeAPIRequest({
                method: GET,
                url: api.getOrderRequests,
                headers: headers,
            })
                .then(async (response: any) => {
                    if (response.status === 200 || response.status === 201) {
                        dispatch({ type: GET_ORDER_REQUESTS, payload: response?.data?.data });
                        if (request.onSuccess) request.onSuccess(response.data);
                    }
                })
                .catch(error => {
                    if (request.onFailure) request.onFailure(error.response);
                });
        };

export const orderRequestAccpet =
    (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
        async dispatch => {
            let headers = {
                Authorization: await getAsyncToken(),
            };
            console.log('request.data', request.data);

            return makeAPIRequest({
                method: POST,
                url: `${api.acceptOrder}/${request.data}`,
                headers: headers,
            })
                .then(async (response: any) => {
                    if (response.status === 200 || response.status === 201) {
                        successToast(response?.data?.message);
                        dispatch({ type: ACCPET_ORDER_REQUESTS, payload: request.data });
                        if (request.onSuccess) request.onSuccess(response.data);
                    }
                })
                .catch(error => {
                    if (request.onFailure) request.onFailure(error.response);
                });
        };

export const orderDeclinedAction =
    (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
        async dispatch => {
            let headers = {
                Authorization: await getAsyncToken(),
            };
            return makeAPIRequest({
                method: POST,
                url: `${api.orderDeclined}/${request.data}`,
                headers: headers,
            })
                .then(async (response: any) => {
                    if (response.status === 200 || response.status === 201) {
                        successToast(response?.data?.message);
                        dispatch({ type: ORDER_DECLINED, payload: request.data });
                        if (request.onSuccess) request.onSuccess(response.data);
                    }
                })
                .catch(error => {
                    if (request.onFailure) request.onFailure(error.response);
                });
        };

export const orderCompletedAction =
    (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
        async dispatch => {
            let headers = {
                Authorization: await getAsyncToken(),
            };
            return makeAPIRequest({
                method: POST,
                url: `${api.orderCompleted}/${request.data}`,
                headers: headers,
            })
                .then(async (response: any) => {
                    if (response.status === 200 || response.status === 201) {
                        successToast(response?.data?.message);
                        dispatch({ type: RUNNING_ORDER_COMPLETED, payload: request.data });
                        if (request.onSuccess) request.onSuccess(response.data);
                    }
                })
                .catch(error => {
                    if (request.onFailure) request.onFailure(error.response);
                });
        };

export const getAllOrderAction =
    (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
        async dispatch => {
            let headers = {
                Authorization: await getAsyncToken(),
            };
            return makeAPIRequest({
                method: GET,
                url: api.ordersHistory,
                headers: headers,
            })
                .then(async (response: any) => {
                    if (response.status === 200 || response.status === 201) {
                        dispatch({ type: GET_ALL_ORDER, payload: response?.data?.data });
                        if (request.onSuccess) request.onSuccess(response.data?.data);
                    }
                })
                .catch(error => {
                    if (request.onFailure) request.onFailure(error.response);
                });
        };

export const getAllOrderFilterAction =
    (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
        async dispatch => {
            let headers = {
                Authorization: await getAsyncToken(),
            };
            return makeAPIRequest({
                method: GET,
                url: api.ordersHistory,
                headers: headers,
                params: request.params
            })
                .then(async (response: any) => {
                    if (response.status === 200 || response.status === 201) {
                        dispatch({ type: GET_ALL_ORDER, payload: response?.data?.data });
                        if (request.onSuccess) request.onSuccess(response.data?.data);
                    }
                })
                .catch(error => {
                    if (request.onFailure) request.onFailure(error.response);
                });
        };

export const getAllStudentOrder =
    (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
        async dispatch => {
            let headers = {
                Authorization: await getAsyncToken(),
            };
            return makeAPIRequest({
                method: GET,
                url: api.studentOrder,
                headers: headers,
            })
                .then(async (response: any) => {
                    if (response.status === 200 || response.status === 201) {
                        dispatch({ type: GET_ALL_STUDENT_ORDER, payload: response?.data?.data });
                        if (request.onSuccess) request.onSuccess(response.data?.data);
                    }
                })
                .catch(error => {
                    if (request.onFailure) request.onFailure(error.response);
                });
        };
export const allStudentOrderFilterAction =
    (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
        async dispatch => {
            let headers = {
                Authorization: await getAsyncToken(),
            };
            return makeAPIRequest({
                method: GET,
                url: api.studentOrder,
                headers: headers,
                params: request.params
            })
                .then(async (response: any) => {
                    if (response.status === 200 || response.status === 201) {
                        dispatch({ type: GET_ALL_STUDENT_ORDER, payload: response?.data?.data });
                        if (request.onSuccess) request.onSuccess(response.data?.data);
                    }
                })
                .catch(error => {
                    if (request.onFailure) request.onFailure(error.response);
                });
        };

export const allMyOrderAction =
    (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
        async dispatch => {
            let headers = {
                Authorization: await getAsyncToken(),
            };
            return makeAPIRequest({
                method: GET,
                url: `${api.myOrders}/${request.data}`,
                headers: headers,
            })
                .then(async (response: any) => {
                    if (response.status === 200 || response.status === 201) {
                        dispatch({ type: GET_ALL_MY_ORDER, payload: response?.data?.data });
                        if (request.onSuccess) request.onSuccess(response.data?.data);
                    }
                })
                .catch(error => {
                    if (request.onFailure) request.onFailure(error.response);
                });
        };

export const invoiceLinkAction =
    (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
        async dispatch => {
            let headers = {};
            return makeAPIRequest({
                method: GET,
                url: `${api.invoiceDownload}/${request.params}`,
                headers: headers,
            })
                .then(async (response: any) => {
                    if (response.status === 200 || response.status === 201) {
                        if (request.onSuccess) request.onSuccess(response.data);
                    }
                })
                .catch(error => {
                    if (request.onFailure) request.onFailure(error.response);
                });
        };