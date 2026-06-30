import { createSlice } from '@reduxjs/toolkit';
import { SagaActions, SagaActionType } from '../sagas/index';

const initialState = {
  feedback: [],
  feedbackSummary: { totalReviews: 0, averageRating: 0 },
  waitlist: [],
  waitlistTotal: 0,
  feedbackLoading: false,
  waitlistLoading: false,
  error: null,
};

export const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.CLEAR}_${SagaActions.FEEDBACK}`,
      (state) => {
        return { ...state, feedbackLoading: true };
      },
    );
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.FEEDBACK}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        return {
          ...state,
          feedback: action?.payload?.reviews || action?.payload?.data || action?.payload?.feedback || [],
          feedbackSummary: action?.payload?.summary || { totalReviews: 0, averageRating: 0 },
          feedbackLoading: false,
          error: null,
        };
      },
    );
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.FEEDBACK}_${SagaActionType.FAIL}`,
      (state, action: any) => {
        return { ...state, feedbackLoading: false, error: action.payload };
      },
    );
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.CLEAR}_${SagaActions.WAITLIST}`,
      (state) => {
        return { ...state, waitlistLoading: true };
      },
    );
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.WAITLIST}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        return {
          ...state,
          waitlist: action?.payload?.data || action?.payload?.waitlist || [],
          waitlistTotal: action?.payload?.totalWaitlist || action?.payload?.total || 0,
          waitlistLoading: false,
          error: null,
        };
      },
    );
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.WAITLIST}_${SagaActionType.FAIL}`,
      (state, action: any) => {
        return { ...state, waitlistLoading: false, error: action.payload };
      },
    );
  },
});

export default feedbackSlice.reducer;
