import { createSlice } from '@reduxjs/toolkit';
import { SagaActions, SagaActionType } from '../sagas/index';


const initialState = {
data:[],
overview:[],
recent_activity:[],
  error: null,
};


export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.DASHBOARD}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        return {
          ...state,
          data: action?.payload || [],
          overview:action?.payload?.overview || [],
          recent_activity:action?.payload?.recent_activity || [],
          loading: false,
          error: null,
        };
      },
    );
  
  },
});

export default dashboardSlice.reducer;