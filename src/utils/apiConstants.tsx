export const api = {
  BASE_URL: 'https://qrder.in/api/',
  // BASE_URL:
  //   'https://1236-2405-201-201f-9802-75f3-a699-d5c8-a2d2.ngrok-free.app/api/',

  // Auth
  login: 'login',
  register: 'register',
  forgotEmail: 'forgot-password/send-otp',
  sendEmailOtp: 'forgot-password/login-with-otp',
  updatePasswords: 'forgot-password/update-password',
  googleEmail: 'login/google',
  updateProfile: 'update-profile',

  get_cities: 'get-cities',
  getCountry: 'get-selected-country',
  getState: 'get-selected-state',
  getCuisines: 'cuisines',
  getChefs: 'chefs',
  getMenu: 'menu',
  updateMenu: 'menu-update',
  chefsRegister: 'chefs',
  search_cities: 'cities/search',
  getCuisinesMenuList: 'cuisine-menu',
  addCard: 'add-to-cart',
  getCard: 'cart',
  getmiscellaneous: 'miscellaneous-items',
  menuMasters: 'menu-masters',
  recipeMaster: 'recipe-master',
  recipeMenu: 'recipe-menu',

  //student
  studentRegister: 'student-register',
  canteenRegister: 'canteen-register',
  universities: 'universities',
  university: 'university',
  cuisineMenu: 'canteen-menu',
  canteenCuisine: 'canteen-cuisine',
  getStudentMenu: 'cuisine-menu',
  waterBottle: 'water-bottle',
};

export const POST = 'POST';
export const GET = 'GET';
export const PUT = 'PUT';
export const DELETE = 'DELETE';
export const PATCH = 'PATCH';

export const GOOGLE_API_KEY = 'AIzaSyDEjeEjROHSLP3YfRln7Sk1GxUQSTGOGCI';

export const GOOGLE_WEB_CLINET_ID =
  '664452756526-me5g021moorbt53hghlcvlekjv5btuno.apps.googleusercontent.com';
