import { all, fork } from 'redux-saga/effects';
import  dashboardSaga  from './dashboardSaga';

export function* rootSaga() {
  yield all([
    fork(dashboardSaga),
  
  ]);
}

export default rootSaga;