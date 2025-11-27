import { createSlice } from '@reduxjs/toolkit';
import { SagaActions, SagaActionType } from '../sagas/index';

export interface AuthState {
  phoneNumber: string ;
  otpSent: boolean;
  token: string | null;
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
    // Send OTP Request
     builder.addMatcher(
      (action) => action.type === `${SagaActions.SEND_OTP}_${SagaActionType.REQUEST}`,
      (state, action: any) => {
  
        
        state.status.sendOtp = 'loading';
        state.error = null;
      }
    );
    // Send OTP Success
    builder.addMatcher(
      (action) => action.type === `${SagaActions.SEND_OTP}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        state.status.sendOtp = 'succeeded';
        state.otpSent = true;
        state.phoneNumber = action.payload.phoneNumber;
        state.error = null;
      }
    );

    // Send OTP Fail
    builder.addMatcher(
      (action) => action.type === `${SagaActions.SEND}_${SagaActions.SEND_OTP}_${SagaActionType.FAIL}`,
      (state, action: any) => {
        state.status.sendOtp = 'failed';
        state.error = action.payload;
        state.otpSent = false;
      }
    );

    // Verify OTP Request
    builder.addMatcher(
      (action) => action.type === `${SagaActions.SEND}_${SagaActions.VERIFY_OTP}_${SagaActionType.REQUEST}`,
      (state) => {
        state.status.verifyOtp = 'loading';
        state.error = null;
      }
    );

    // Verify OTP Success
    builder.addMatcher(
      (action) => action.type === `${SagaActions.VERIFY_OTP}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        state.status.verifyOtp = 'succeeded';
        state.token = action.payload.token;
        state.verify = {
          ...action.payload,
          isProfileComplete: action.payload.isProfileComplete,
          userType: action.payload.userType,
          userId: action.payload.userId,
        };
        localStorage.setItem('token', action.payload.token);
        state.error = null;
      }
    );

    // Verify OTP Fail
    builder.addMatcher(
      (action) => action.type === `${SagaActions.VERIFY_OTP}_${SagaActionType.FAIL}`,
      (state, action: any) => {
        state.status.verifyOtp = 'failed';
        state.error = action.payload;
        state.token = null;
        localStorage.removeItem('token');
      }
    );
  },
});

export default authSlice.reducer;