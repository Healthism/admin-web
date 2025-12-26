// Import statements for all saga modules
import { spawn } from 'redux-saga/effects';

import AuthSaga from './auth/authSaga';
import UsersSaga from './users/userSaga';
import transactionsSaga from './transactions/transactionsSaga';
import promoCodesSaga from './promoCodes/promoCodesSaga';
import dashboardSaga from './dashboard/dashboardSaga';
import profileSaga from './profile/profileSaga';

// Export default function rootSaga
export default function* rootSaga() {
  // Spawn all sagas here
  yield spawn(AuthSaga);
  yield spawn(UsersSaga);
  yield spawn(transactionsSaga);
  yield spawn(promoCodesSaga);
  yield spawn(dashboardSaga);
  yield spawn(profileSaga);

}

// Export enum SagaActions
export enum SagaActions {
  // Common actions
  FETCH = 'FETCH',
  PATCH = "PATCH",
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SEND = 'SEND',
  GET = 'GET',
  SET = 'SET',
  CLEAR = 'CLEAR',
  FAIL = 'FAIL',
  EXPORT = 'EXPORT',
  
  // Entity names
  AUTH = 'AUTH',
  LOGIN_ADMIN = 'LOGIN_ADMIN',
  USERS = 'USERS',
  TRANSACTIONS = 'TRANSACTIONS',
  PROMO_CODES = 'PROMO_CODES',
  PROMO_CODE = 'PROMO_CODE',
  DASHBOARD = 'DASHBOARD',  
  INVOICE = 'INVOICE',
  EXPORT_USERS = 'EXPORT_USERS',
  SUSPEND_USERS = 'SUSPEND_USERS',
  PROFILE = 'PROFILE',
  TRANSACTIONS_GRAPH = 'TRANSACTIONS_GRAPH',
}

// Export enum SagaActionType
export enum SagaActionType {
  REQUEST = 'REQUEST',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

// Export enum ApiEndpoints 
export enum ApiEndpoints {
  // Auth endpoints
  SEND_OTP = '/auth/send-otp',
  VERIFY_OTP = '/auth/verify',
  
  // Lab endpoints
  LAB_PROFILE = '/labs/profile',
  UPDATE_PROFILE = '/labs/update-profile',

}