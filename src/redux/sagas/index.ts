// Import statements for all saga modules
import { spawn } from 'redux-saga/effects';

import AuthSaga from './auth/authSaga';
import UsersSaga from './users/userSaga';

// Export default function rootSaga
export default function* rootSaga() {
  // Spawn all sagas here
  yield spawn(AuthSaga);
  yield spawn(UsersSaga);

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
  
  // Entity names
  AUTH = 'AUTH',
  LOGIN_ADMIN = 'LOGIN_ADMIN',
  USERS = 'USERS',
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