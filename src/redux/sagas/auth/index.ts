import { all, fork } from 'redux-saga/effects';
import authSaga  from './authSaga';

export function* rootSaga() {
  yield all([
    fork(authSaga),
    // Add other sagas here as needed
    // fork(userSaga),
    // fork(productSaga),
  ]);
}

export default rootSaga;