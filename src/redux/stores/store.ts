// store.ts
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas/index'; 
import authReducer from '../slices/authSlice';
import usersReducer from '../slices/usersSlice';
import transactionsReducer from '../slices/transactionsSlice';
import promoCodesReducer from '../slices/promoCodesSlice';
import notificationReducer from '../slices/notificationSlice';
import notificationMiddleware from '../middleware/notificationMiddleware';
import dashboardReducer from '../slices/dahboardSlice';
import profileReducer from '../slices/profileSlice';

// Create and configure store
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    transactions: transactionsReducer,
    promoCodes: promoCodesReducer,
    notification: notificationReducer,
    dashboard: dashboardReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware).concat(notificationMiddleware),
});

// Start sagas
sagaMiddleware.run(rootSaga);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;