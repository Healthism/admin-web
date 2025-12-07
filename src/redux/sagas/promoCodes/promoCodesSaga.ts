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
import type {
  deletePromoCodesPayload,
  getPromoCodePayload,
  getPromoCodesPayload,
  postPromoCodesPayload,
  updatePromoCodePayload,
} from "./promoCodesSagaAction";
import { getPromoCodes } from "./promoCodesSagaAction";
import type { AnyAction } from "redux-saga";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { showNotification } from '../../slices/notificationSlice';

// API: PROMO_CODES
export function* fetchPromoCodes({
  payload,
}: getPromoCodesPayload): Generator<
  CallEffect<any> | PutEffect<AnyAction>,
  void,
  any
> {
  // const token = getAuthToken();

  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.PROMO_CODES}`,
  });

  try {
    const endpoint = API_ENDPOINTS.PROMO_CODES.GET_PROMO_CODES;
    const endpointWithQuery = endpoint;

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
      type: `${SagaActions.FETCH}_${SagaActions.PROMO_CODES}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
    // show optional message returned by API
    if (response && (response.message || response.msg)) {
      yield put(showNotification({ message: response.message || response.msg, severity: 'success' }));
    }
  } catch (error: any) {
    console.error("❌ Users fetch failed:", error);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PROMO_CODES}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch promo codes data",
    });

    // notify error
    yield put(showNotification({ message: error?.message || 'Failed to fetch promo codes data', severity: 'error' }));

    console.error(
      "🔴 Dispatched FETCH_FAIL action with error:",
      error?.message
    );
  }
}

export function* updatePromoCode({
  payload,
}: updatePromoCodePayload): Generator<
  CallEffect<any> | PutEffect<AnyAction>,
  void,
  any
> {
  // const token = getAuthToken();

  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.PROMO_CODE}`,
  });

  try {
    const endpoint = API_ENDPOINTS.PROMO_CODES.UPDATE_PROMO_CODE + `/${payload?._id}`;
    const endpointWithQuery = endpoint;

    const response = yield call(apiRequest, endpointWithQuery, {
      method: "PUT",
      headers: {
        // 'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response) {
      throw new Error("Empty response received from server");
    }

    yield put({
      type: `${SagaActions.UPDATE}_${SagaActions.PROMO_CODE}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
    // show optional message returned by API
    if (response && (response.message || response.msg)) {
      yield put(showNotification({ message: response.message || response.msg, severity: 'success' }));
    }

       yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PROMO_CODES}_${SagaActionType.REQUEST}`,
    });
  } catch (error: any) {
    console.error("❌ Promo code update failed:", error);

    yield put({
      type: `${SagaActions.UPDATE}_${SagaActions.PROMO_CODE}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to update promo codes data",
    });

    // notify error
    yield put(showNotification({ message: error?.message || 'Failed to update promo codes data', severity: 'error' }));
    console.error(
      "🔴 Dispatched FETCH_FAIL action with error:",
      error?.message
    );
  }
}

export function* fetchPromoCodeById({
  payload,
}: getPromoCodePayload): Generator<
  CallEffect<any> | PutEffect<AnyAction>,
  void,
  any
> {
  // const token = getAuthToken();

  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.PROMO_CODE}`,
  });

  try {
    const endpoint = API_ENDPOINTS.PROMO_CODES.GET_PROMO_CODE_BY_ID + `/${payload?._id}`;
    const endpointWithQuery = endpoint;

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
      type: `${SagaActions.FETCH}_${SagaActions.PROMO_CODE}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
    // show optional message returned by API
    if (response && (response.message || response.msg)) {
      yield put(showNotification({ message: response.message || response.msg, severity: 'success' }));
    }
  } catch (error: any) {
    console.error("❌ Promo code fetch failed:", error);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PROMO_CODE}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch promo codes data",
    });

    // notify error
    yield put(showNotification({ message: error?.message || 'Failed to fetch promo codes data', severity: 'error' }));

    console.error(
      "🔴 Dispatched FETCH_FAIL action with error:",
      error?.message
    );
  }
}

export function* createPromoCodes({
  payload,
}: postPromoCodesPayload): Generator<
  CallEffect<any> | PutEffect<AnyAction>,
  void,
  any
> {
  // const token = getAuthToken();

  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.PROMO_CODES}`,
  });

  try {
    const endpoint = API_ENDPOINTS.PROMO_CODES.CREATE_PROMO_CODE;
    const endpointWithQuery = endpoint;

    const response = yield call(apiRequest, endpointWithQuery, {
      method: "POST",
      headers: {
        // 'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response) {
      throw new Error("Empty response received from server");
    }

    yield put({
      type: `${SagaActions.SEND}_${SagaActions.PROMO_CODES}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    // notify success
    yield put(showNotification({ message: response?.message || 'Promo created successfully', severity: 'success' }));

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PROMO_CODES}_${SagaActionType.REQUEST}`,
    });
    
  } catch (error: any) {
    console.error("❌ Users fetch failed:", error);

    yield put({
      type: `${SagaActions.SEND}_${SagaActions.PROMO_CODES}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch promo codes data",
    });

    // notify error
    yield put(showNotification({ message: error?.message || 'Failed to create promo codes', severity: 'error' }));

    console.error("🔴 Dispatched SEND_FAIL action with error:", error?.message);
  }
}

export function* deletePromoCodes({
  payload,
}: deletePromoCodesPayload): Generator<
  CallEffect<any> | PutEffect<AnyAction>,
  void,
  any
> {
  // const token = getAuthToken();

  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.PROMO_CODES}`,
  });

  try {
    const endpoint = API_ENDPOINTS.PROMO_CODES.DELETE_PROMO_CODE + `/${payload?._id}`;
    const endpointWithQuery = endpoint;

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
      type: `${SagaActions.DELETE}_${SagaActions.PROMO_CODES}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    // notify success
    yield put(showNotification({ message: response?.message || 'Promo deleted successfully', severity: 'success' }));

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PROMO_CODES}_${SagaActionType.REQUEST}`,
    });
    
  } catch (error: any) {
    console.error("❌ Users fetch failed:", error);

    yield put({
      type: `${SagaActions.DELETE}_${SagaActions.PROMO_CODES}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to delete promo codes data",
    });

    // notify error
    yield put(showNotification({ message: error?.message || 'Failed to delete promo codes', severity: 'error' }));

    console.error("🔴 Dispatched DELETE_FAIL action with error:", error?.message);
  }
}
// Watcher functions

function* promoCodesWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.PROMO_CODES}_${SagaActionType.REQUEST}`,
    fetchPromoCodes
  );
}

function* getPromoCodeWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.PROMO_CODE}_${SagaActionType.REQUEST}`,
    fetchPromoCodeById
  );
}

function* updatePromoCodeWatcher() {
  yield takeEvery(
    `${SagaActions.UPDATE}_${SagaActions.PROMO_CODE}_${SagaActionType.REQUEST}`,
    updatePromoCode
  );
}

function* createPromoCodesWatcher() {
  yield takeEvery(
    `${SagaActions.SEND}_${SagaActions.PROMO_CODES}_${SagaActionType.REQUEST}`,
    createPromoCodes
  );
}

function* deletePromoCodesWatcher() {
  yield takeEvery(
    `${SagaActions.DELETE}_${SagaActions.PROMO_CODES}_${SagaActionType.REQUEST}`,
    deletePromoCodes
  );
}

// Root auth saga
export default function* rootPromoCodesSaga() {
  yield spawn(promoCodesWatcher);
  yield spawn(createPromoCodesWatcher);
  yield spawn(deletePromoCodesWatcher);
  yield spawn(getPromoCodeWatcher);
  yield spawn(updatePromoCodeWatcher);
}
