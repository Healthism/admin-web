import { createSlice } from '@reduxjs/toolkit';
import { SagaActions, SagaActionType } from '../sagas/index';

const initialState: {
  users: any[];
  toggleStatusLoading: boolean;
  error: any;
} = {
  users: [],
  toggleStatusLoading: false,
  error: null,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.FETCH}_${SagaActions.USERS}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        return {
          ...state,
          users: action?.payload?.users || [],
          error: null,
        };
      },
    );
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.CLEAR}_${SagaActions.TOGGLE_USER_STATUS}`,
      (state) => {
        return { ...state, toggleStatusLoading: true };
      },
    );
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.PATCH}_${SagaActions.TOGGLE_USER_STATUS}_${SagaActionType.SUCCESS}`,
      (state, action: any) => {
        const updatedUserId = action?.payload?.userId;
        const newStatus = action?.payload?.status;
        return {
          ...state,
          toggleStatusLoading: false,
          users: updatedUserId && newStatus
            ? (state.users as any[]).map((u: any) => u._id === updatedUserId ? { ...u, status: newStatus } : u)
            : state.users,
          error: null,
        };
      },
    );
    builder.addMatcher(
      (action: any) => action.type === `${SagaActions.PATCH}_${SagaActions.TOGGLE_USER_STATUS}_${SagaActionType.FAIL}`,
      (state, action: any) => {
        return { ...state, toggleStatusLoading: false, error: action.payload };
      },
    );
  },
});

export default usersSlice.reducer;
