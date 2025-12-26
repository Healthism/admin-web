import { createSlice } from '@reduxjs/toolkit';
import { SagaActions, SagaActionType } from '../sagas/index';


const initialState = {
users:[],
  error: null,
};


export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Send OTP Request
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.USERS}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        return {
          ...state,
          users: action?.payload?.users || [],
          loading: false,
          error: null,
        };
      },
    );
  
  },
});

export default usersSlice.reducer;