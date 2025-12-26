import { all, fork } from 'redux-saga/effects';
import promoCodesSaga from './promoCodesSaga';
export function* rootSaga() {
  yield all([
    fork(promoCodesSaga),
  
  ]);
}

export default rootSaga;