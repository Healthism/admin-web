import { all, fork } from 'redux-saga/effects';
import profileSaga  from './profileSaga';
export function* rootSaga() {
  yield all([
    fork(profileSaga),
  
  ]);
}

export default rootSaga;