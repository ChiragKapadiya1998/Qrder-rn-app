export const api = {
  BASE_URL: 'https://qrder.in/api/',
  // BASE_URL1: 'https://qrder.in/',
  // BASE_URL:
  // 'https://3a5e-2405-201-201f-9802-6958-ad41-1fe8-e519.ngrok-free.app/api/',

  // Auth
  login: 'login',
  register: 'register',
  forgotEmail: 'forgot-password/send-otp',
  sendEmailOtp: 'forgot-password/login-with-otp',
  updatePasswords: 'forgot-password/update-password',
  googleEmail: 'login/google',
  updateProfile: 'update-profile',
  appleLogin: 'login/apple',

  get_cities: 'get-cities',
  getCountry: 'get-selected-country',
  getState: 'get-selected-state',
  getCuisines: 'cuisines',
  getCuisinesUpdate: 'cuisine-update',
  getCuisines: 'cuisines',
  getChefs: 'chefs',
  getMenu: 'menu',
  updateMenu: 'menu-update',
  chefsRegister: 'chefs',
  updateChef: 'update-chef',
  search_cities: 'cities/search',
  getCuisinesMenuList: 'cuisine-menu',
  addCard: 'add-to-cart',
  getCard: 'cart',
  getmiscellaneous: 'miscellaneous-items',
  menuMasters: 'menu-masters',
  recipeMaster: 'recipe-master',
  recipeMenu: 'recipe-menu',
  updateDiscount: 'update-discount',
  getDiscount: 'discount',
  getSupportType: 'support-type',
  addSupport: 'support',
  getRunningOrders: 'running-orders',
  getOrderRequests: 'order-requests',
  acceptOrder: 'order-accepted',
  orderDeclined: 'order-declined',
  orderCompleted: 'order-completed',
  ordersHistory: 'orders',
  studentOrder: 'student-orders',
  dashboard: 'dashboard',
  myOrders: 'order',
  universityUpdate: 'university-update',
  getUser: 'get-user',
  orderCreate: 'order-create',
  restaurantDiscount: 'restaurant-discount',
  changePassword: 'change-password',
  invoiceDownload:'invoice-download',
  search_menu_list: 'search-menu',

  //student
  studentRegister: 'student-register',
  canteenRegister: 'canteen-register',
  universities: 'universities',
  university: 'university',
  cuisineMenu: 'canteen-menu',
  canteenCuisine: 'canteen-cuisine',
  getStudentMenu: 'cuisine-menu',
  waterBottle: 'add/water-bottle',
};

export const POST = 'POST';
export const GET = 'GET';
export const PUT = 'PUT';
export const DELETE = 'DELETE';
export const PATCH = 'PATCH';

export const GOOGLE_API_KEY = 'AIzaSyDEjeEjROHSLP3YfRln7Sk1GxUQSTGOGCI';

export const GOOGLE_WEB_CLINET_ID =
  '664452756526-me5g021moorbt53hghlcvlekjv5btuno.apps.googleusercontent.com';
