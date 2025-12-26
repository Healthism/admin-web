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
import type { getUsersPayload, suspendUsersPayload } from "./userSagaAction";
import type { AnyAction } from "redux-saga";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { showNotification } from "../../../redux/slices/notificationSlice";

// API: AUTH
export function* fetchUsers({
  payload,
}: getUsersPayload): Generator<
  CallEffect<any> | PutEffect<AnyAction>,
  void,
  any
> {
  // const token = getAuthToken();

  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.USERS}`,
  });

  try {
    const endpoint = API_ENDPOINTS.USERS.GET_USERS;
    const endpointWithQuery = payload?.type
      ? `${endpoint}?type=${encodeURIComponent(payload.type)}&${
          payload.search ? `search=${encodeURIComponent(payload.search)}` : ""
        }${
          payload.status ? `&status=${encodeURIComponent(payload.status)}` : ""
        } `
      : endpoint;

    const response = yield call(apiRequest, endpointWithQuery, {
      method: "GET",
      headers: {
        // 'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!response) {
      throw new Error("Empty response received from server");
    }

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.USERS}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    console.error("❌ Users fetch failed:", error);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.USERS}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch users data",
    });

    console.error(
      "🔴 Dispatched FETCH_FAIL action with error:",
      error?.message
    );
  }
}

export function* fetchExportUsers({
  payload,
}: getUsersPayload): Generator<
  CallEffect<any> | PutEffect<AnyAction>,
  void,
  any
> {
  // const token = getAuthToken();

  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.EXPORT_USERS}`,
  });

  try {
    const endpoint = API_ENDPOINTS.USERS.EXPORT_USERS;
    const endpointWithQuery = payload?.type
      ? `${endpoint}?type=${encodeURIComponent(payload.type)}`
      : endpoint;

   // GET FILE AS BLOB
    const blob: Blob = yield call(apiRequest, endpointWithQuery, {
      method: "GET",
      isBinary: true,       
    });

    // Create file download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users.xlsx";
    link.click();
    window.URL.revokeObjectURL(url);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.EXPORT_USERS}_${SagaActionType.SUCCESS}`,
    });
    
  } catch (error: any) {
    console.error("❌ Users fetch failed:", error);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.EXPORT_USERS}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch users data",
    });

    console.error(
      "🔴 Dispatched FETCH_FAIL action with error:",
      error?.message
    );
  }
}


export function* suspendUsers({
  payload,
}: suspendUsersPayload): Generator<
  CallEffect<any> | PutEffect<AnyAction>,
  void,
  any
> {
  // const token = getAuthToken();

  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.SUSPEND_USERS}`,
  });

  try {
    const endpoint = API_ENDPOINTS.USERS.SUSPEND_USERS;
    const endpointWithQuery = payload?.userId
      ? `${endpoint}/${encodeURIComponent(payload.userId)}`
      : endpoint;

    const response = yield call(apiRequest, endpointWithQuery, {
      method: "DELETE",
      headers: {
        // 'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!response) {
      throw new Error("Empty response received from server");
    }

    yield put({
      type: `${SagaActions.DELETE}_${SagaActions.SUSPEND_USERS}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    yield put(showNotification({ message: response.message || response.msg, severity: 'success' }));
    
  } catch (error: any) {
    console.error("❌ Users suspend failed:", error);

    yield put({
      type: `${SagaActions.DELETE}_${SagaActions.SUSPEND_USERS}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to suspend users data",
    });

    console.error(
      "🔴 Dispatched FETCH_FAIL action with error:",
      error?.message
    );
  }
}
// Watcher functions

function* usersWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.USERS}_${SagaActionType.REQUEST}`,
    fetchUsers
  );
}

function* exportUsersWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.EXPORT_USERS}_${SagaActionType.REQUEST}`,
    fetchExportUsers
  );
}

function* suspendUsersWatcher() {
  yield takeEvery(
    `${SagaActions.DELETE}_${SagaActions.SUSPEND_USERS}_${SagaActionType.REQUEST}`,
    suspendUsers
  );
}

// Root auth saga
export default function* rootUsersSaga() {
  yield spawn(usersWatcher);
  yield spawn(exportUsersWatcher);
  yield spawn(suspendUsersWatcher);
}
