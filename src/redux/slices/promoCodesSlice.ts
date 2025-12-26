import { createSlice } from '@reduxjs/toolkit';
import { SagaActions, SagaActionType } from '../sagas/index';


const initialState = {
promoCodes:[],
promoCode:[],
  error: null,
};


export const promoCodesSlice = createSlice({
  name: 'promoCodes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.PROMO_CODES}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        return {
          ...state,
          promoCodes: action.payload.data,
          loading: false,
          error: null,
        };
      },
    );   
     builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.PROMO_CODE}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        return {
          ...state,
          promoCode: action?.payload?.data,
          loading: false,
          error: null,
        };
      },
    );
  
  },
});

export default promoCodesSlice.reducer;