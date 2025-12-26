import {
  put,
  call,
  spawn,
  takeEvery,
  all,
  type CallEffect,
  type PutEffect,
} from "redux-saga/effects";
import { SagaActionType, SagaActions } from "../index";
import type { getProfilePayload } from "./profileSagaAction";
import type { AnyAction } from "redux-saga";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { showNotification } from "../../slices/notificationSlice";

// API: TRANSACTIONS

export function* fetchProfile({
  payload,
}: getProfilePayload): Generator<
  CallEffect<any> | PutEffect<AnyAction>,
  void,
  any
> {
  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.PROFILE}`,
  });

  try {

    const endpoint = API_ENDPOINTS.AUTH.PROFILE;

    const response = yield call(apiRequest, endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!response) {
      throw new Error("Empty response received from server");
    }

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PROFILE}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PROFILE}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch profile data",
    });
  }
}

// Watcher functions

function* profileWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.PROFILE}_${SagaActionType.REQUEST}`,
    fetchProfile
  );
}

// Root auth saga
export default function* rootProfileSaga() {
  yield spawn(profileWatcher);
}
