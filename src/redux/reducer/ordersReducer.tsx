import { ACCPET_ORDER_REQUESTS, GET_ALL_ORDER, GET_ORDER_REQUESTS, GET_RUNNING_ORDERS, ORDER_COMPLETED, ORDER_DECLINED, RUNNING_ORDER_COMPLETED } from "../actionTypes";

const initialState = {
    isRunningOrder: [],
    isOrderRequest: [],
    allOrderHistory: []
};

export default function (state = initialState, action: any) {
    switch (action.type) {
        case GET_RUNNING_ORDERS: {
            return { ...state, isRunningOrder: action.payload };
        }
        case GET_ORDER_REQUESTS: {
            return { ...state, isOrderRequest: action.payload };
        }
        case ACCPET_ORDER_REQUESTS: {
            const accpetOrder = state.isOrderRequest.filter(
                item => item?.id !== action.payload,
            );
            return { ...state, isOrderRequest: accpetOrder };
        }
        case ORDER_DECLINED: {

            const declinedOrderId = action.payload;
            const updatedRunningOrders = state.isRunningOrder.filter(order => order.id !== declinedOrderId);
            const updatedOrderRequests = state.isOrderRequest.filter(order => order.id !== declinedOrderId);

            return {
                ...state,
                isRunningOrder: updatedRunningOrders,
                isOrderRequest: updatedOrderRequests,
            };
        }
        case RUNNING_ORDER_COMPLETED: {
            const runningOrderComplete = state.isRunningOrder.filter(
                item => item?.id !== action.payload,
            );
            return { ...state, isRunningOrder: runningOrderComplete };
        }
        case GET_ALL_ORDER: {
            return { ...state, allOrderHistory: action.payload };
        }

        default:
            return state;
    }
}
