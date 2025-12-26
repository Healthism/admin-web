import { all, fork } from 'redux-saga/effects';
import transactionsSaga  from './transactionsSaga';
export function* rootSaga() {
  yield all([
    fork(transactionsSaga),
  
  ]);
}

export default rootSaga;