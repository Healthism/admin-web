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
import type { PostLoginPayload } from "./authSagaAction";
import type { AnyAction } from "redux-saga";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { getInvoicePayload } from "../transactions/transactionsSagaAction";

// API: AUTH
function* loginAdmin({
  payload,
}: PostLoginPayload): Generator<
  CallEffect<any> | PutEffect<AnyAction>,
  void,
  any
> {
  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.LOGIN_ADMIN}`,
  });

  try {
    const response = yield call(apiRequest, API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        username: payload.username,
        password: payload.password,
      }),
    });

    // SAVE TOKEN
    if (response.token) {
      localStorage.setItem("token", response.token);
    }

    yield put({
      type: `${SagaActions.LOGIN_ADMIN}_${SagaActionType.SUCCESS}`,
      payload: {
        message: response.message || "Login successful",
        username: payload.username,
      },
    });
  } catch (error: any) {
    console.error("❌ Error logging in admin:", error);

    yield put({
      type: `${SagaActions.LOGIN_ADMIN}_${SagaActionType.FAIL}`,
      payload: error.message || "Failed to login. Please try again.",
    });
  }
}


// Watcher functions

function* loginAdminWatcher() {
  yield takeEvery(
    `${SagaActions.LOGIN_ADMIN}_${SagaActionType.REQUEST}`,
    loginAdmin
  );
}



// Root auth saga
export default function* rootAuthSaga() {
  yield spawn(loginAdminWatcher);
}
