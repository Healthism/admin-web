import { createSlice } from '@reduxjs/toolkit';
import { SagaActions, SagaActionType } from '../sagas/index';


const initialState = {
transactions:[],
invoice: [],
transactionsGraph: [],
  error: null,
};


export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.TRANSACTIONS}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        return {
          ...state,
          transactions: action?.payload?.data || [],
          loading: false,
          error: null,
        };
      },
    );
    
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.INVOICE}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        return {
          ...state,
          invoice: action?.payload?.invoice || [],
          loading: false,
          error: null,
        };
      },
    ); 
    
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.TRANSACTIONS_GRAPH}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        return {
          ...state,
          transactionsGraph: action?.payload?.data || [],
          loading: false,
          error: null,
        };
      },
    );
  
  },
});

export default transactionsSlice.reducer;