import { createSlice } from '@reduxjs/toolkit';
import { SagaActions, SagaActionType } from '../sagas/index';

const initialState = {
  payouts: [],
  summary: {
    total_earnings: 0,
    total_orders: 0,
    total_amount_paid: 0,
    payouts_count: 0,
    pending_settlement: 0,
    todays_payout: 0,
    todays_pharmacy_count: 0,
  },
  razorpaySettlements: [],
  error: null,
};

export const payoutsSlice = createSlice({
  name: 'payouts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.PAYOUTS}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        return {
          ...state,
          payouts: action?.payload?.data || [],
          loading: false,
          error: null,
        };
      },
    );

    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.PAYOUTS_SUMMARY}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        return {
          ...state,
          summary: action?.payload?.data || state.summary,
          loading: false,
          error: null,
        };
      },
    );

    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.RAZORPAY_SETTLEMENTS}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        return {
          ...state,
          razorpaySettlements: action?.payload?.data || [],
          loading: false,
          error: null,
        };
      },
    );
  },
});

export default payoutsSlice.reducer;
