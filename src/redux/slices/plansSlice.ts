import { createSlice } from '@reduxjs/toolkit';
import { SagaActions, SagaActionType } from '../sagas/index';

const initialState = {
  plans: [],
  analytics: null,
  error: null,
};

export const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.PLANS}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        return {
          ...state,
          plans: action?.payload?.plans || action?.payload?.data || [],
          loading: false,
          error: null,
        };
      },
    );
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.PLAN_ANALYTICS}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        return {
          ...state,
          analytics: action?.payload?.analytics || action?.payload?.data || null,
          loading: false,
          error: null,
        };
      },
    );
  },
});

export default plansSlice.reducer;
