import { createSlice } from '@reduxjs/toolkit';
import { SagaActions, SagaActionType } from '../sagas/index';


const initialState = {
profile: [],
  error: null,
};


export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.PROFILE}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        return {
          ...state,
          adminProfile: action?.payload?.data || [],
          loading: false,
          error: null,
        };
      },
    );
  
  },
});

export default profileSlice.reducer;