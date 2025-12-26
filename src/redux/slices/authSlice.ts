import { createSlice } from '@reduxjs/toolkit';
import { SagaActions, SagaActionType } from '../sagas/index';

export interface AuthState {
  phoneNumber: string ;
  otpSent: boolean;
  token: string | null;
  username?: string;
  loginStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  verify: {
    isProfileComplete: boolean;
    userType?: string;
    userId?: string;
    [key: string]: any;
  };
  status: {
    sendOtp: 'idle' | 'loading' | 'succeeded' | 'failed';
    verifyOtp: 'idle' | 'loading' | 'succeeded' | 'failed';
  };
  error: string | null;
}

const initialState: AuthState = {
  phoneNumber: '',
  otpSent: false,
  token: localStorage.getItem('token') ,
  username: undefined,
  loginStatus: 'idle',
  verify: {
    isProfileComplete: false,
  },
  status: {
    sendOtp: 'idle',
    verifyOtp: 'idle',
  },
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      return { ...initialState, token: state.token };
    },
  },
  extraReducers: (builder) => {
    // Login Admin Request
    builder.addMatcher(
      (action) => action.type === `${SagaActions.LOGIN_ADMIN}_${SagaActionType.REQUEST}`,
      (state) => {
        state.loginStatus = 'loading';
        state.error = null;
      }
    );

    // Login Admin Success
    builder.addMatcher(
      (action) => action.type === `${SagaActions.LOGIN_ADMIN}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        state.loginStatus = 'succeeded';
        state.token = action.payload?.token || 'authenticated';
        state.username = action.payload?.username;
        state.error = null;
        if (action.payload?.token) {
          localStorage.setItem('token', action.payload.token);
        }
      }
    );

    // Login Admin Fail
    builder.addMatcher(
      (action) => action.type === `${SagaActions.LOGIN_ADMIN}_${SagaActionType.FAIL}`,
      (state, action: any) => {
        state.loginStatus = 'failed';
        state.error = action.payload;
        state.token = null;
        localStorage.removeItem('token');
      }
    );

    
  },
});

export default authSlice.reducer;