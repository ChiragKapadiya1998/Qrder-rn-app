import {
  DECREMENT,
  GET_CITY_DATA,
  GET_DISCOUNT,
  GET_SUPPORT_TYPE,
  INCREMENT,
  IS_LOADING,
  IS_LOADING_NEW,
  SEARCH_CITY,
  SELECT_ROLE,
  SET_APP_LANGUAGE,
  SET_APP_THEME,
  SET_FOOD_VEG,
} from '../actionTypes';

const initialState = {
  isLoading: false,
  isLoadingNew: false,
  isDarkTheme: false,
  searchCity: [],
  selectedRole: '',
  isLanguage: 'en',
  discount: 0,
  getSupport: [],
  isFoodVeg: 1,
  getCity: [
    {
      id: 1041,
      name: 'Surat',
      state_id: 12,
      created_at: null,
      updated_at: null,
      state_name: 'Gujarat',
      state: {
        id: 12,
        name: 'Gujarat',
        country_id: 1,
        created_at: null,
        updated_at: null,
        country_name: 'India',
        country: {
          id: 1,
          name: 'India',
          created_at: null,
          updated_at: null,
        },
      },
    },
    {
      id: 1043,
      name: 'Talaja',
      state_id: 12,
      created_at: null,
      updated_at: null,
      state_name: 'Gujarat',
      state: {
        id: 12,
        name: 'Gujarat',
        country_id: 1,
        created_at: null,
        updated_at: null,
        country_name: 'India',
        country: {
          id: 1,
          name: 'India',
          created_at: null,
          updated_at: null,
        },
      },
    },
  ],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case IS_LOADING: {
      return { ...state, isLoading: action.payload };
    }
    case IS_LOADING_NEW: {
      return { ...state, isLoadingNew: action.payload };
    }
    case SET_APP_THEME: {
      return { ...state, isDarkTheme: action.payload };
    }
    case GET_CITY_DATA: {
      return { ...state, getCity: action.payload };
    }
    case SEARCH_CITY: {
      return { ...state, searchCity: action.payload };
    }
    case SELECT_ROLE: {
      return { ...state, selectedRole: action.payload };
    }
    case SET_APP_LANGUAGE: {
      return { ...state, isLanguage: action.payload };
    }
    case GET_DISCOUNT: {
      return { ...state, discount: action.payload };
    }
    case GET_SUPPORT_TYPE: {
      return { ...state, getSupport: action.payload };
    }
    case SET_FOOD_VEG: {
      return { ...state, isFoodVeg: action.payload };
    }
    default:
      return state;
  }
}
