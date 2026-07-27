import {
  put,
  call,
  spawn,
  takeEvery,
  takeLatest,
  type CallEffect,
  type PutEffect,
} from "redux-saga/effects";
import { SagaActionType, SagaActions } from "../index";
import type {
  getPayoutsPayload,
  getSummaryPayload,
  getRazorpaySettlementsPayload,
  payPayoutPayload,
  updatePayoutStatusPayload,
} from "./payoutsSagaAction";
import type { AnyAction } from "redux-saga";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { showNotification } from "../../../redux/slices/notificationSlice";

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
});

export function* fetchPayouts({
  payload,
}: getPayoutsPayload
): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.PAYOUTS}`,
  });

  try {
    const endpoint = API_ENDPOINTS.PAYOUTS.GET_PAYOUTS;

    const queryParams: string[] = [];

    if (payload?.status) {
      queryParams.push(`status=${encodeURIComponent(payload.status)}`);
    }
    if (payload?.search) {
      queryParams.push(`search=${encodeURIComponent(payload.search)}`);
    }
    if (payload?.from) {
      queryParams.push(`from=${encodeURIComponent(payload.from)}`);
    }
    if (payload?.to) {
      queryParams.push(`to=${encodeURIComponent(payload.to)}`);
    }
    if (payload?.provider) {
      queryParams.push(`provider=${encodeURIComponent(payload.provider)}`);
    }

    const endpointWithQuery = queryParams.length > 0
      ? `${endpoint}?${queryParams.join('&')}`
      : endpoint;

    const response = yield call(
      apiRequest,
      endpointWithQuery,
      {
        method: 'GET',
        headers: authHeaders(),
        credentials: 'include'
      }
    );

    if (!response) {
      throw new Error('Empty response received from server');
    }

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PAYOUTS}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

  } catch (error: any) {
    console.error('❌ Payouts fetch failed:', error);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PAYOUTS}_${SagaActionType.FAIL}`,
      payload: error?.message || 'Failed to fetch payouts data',
    });
  }
}

export function* fetchPayoutsSummary({
  payload,
}: getSummaryPayload
): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.PAYOUTS_SUMMARY}`,
  });

  try {
    const endpoint = API_ENDPOINTS.PAYOUTS.GET_SUMMARY;

    const response = yield call(
      apiRequest,
      endpoint,
      {
        method: 'GET',
        headers: authHeaders(),
        credentials: 'include'
      }
    );

    if (!response) {
      throw new Error('Empty response received from server');
    }

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PAYOUTS_SUMMARY}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

  } catch (error: any) {
    console.error('❌ Payouts summary fetch failed:', error);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PAYOUTS_SUMMARY}_${SagaActionType.FAIL}`,
      payload: error?.message || 'Failed to fetch payouts summary',
    });
  }
}

export function* fetchRazorpaySettlements({
  payload,
}: getRazorpaySettlementsPayload
): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.RAZORPAY_SETTLEMENTS}`,
  });

  try {
    const endpoint = API_ENDPOINTS.PAYOUTS.GET_RAZORPAY_SETTLEMENTS;

    const endpointWithQuery = payload?.count
      ? `${endpoint}?count=${encodeURIComponent(payload.count)}`
      : endpoint;

    const response = yield call(
      apiRequest,
      endpointWithQuery,
      {
        method: 'GET',
        headers: authHeaders(),
        credentials: 'include'
      }
    );

    if (!response) {
      throw new Error('Empty response received from server');
    }

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.RAZORPAY_SETTLEMENTS}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

  } catch (error: any) {
    console.error('❌ Razorpay settlements fetch failed:', error);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.RAZORPAY_SETTLEMENTS}_${SagaActionType.FAIL}`,
      payload: error?.message || 'Failed to fetch razorpay settlements',
    });
  }
}

export function* payPayoutWorker({
  payload,
}: payPayoutPayload
): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  try {
    const endpoint = `${API_ENDPOINTS.PAYOUTS.PAY_PAYOUT}/${encodeURIComponent(payload.pharmacyId)}/pay`;

    const response = yield call(
      apiRequest,
      endpoint,
      {
        method: 'POST',
        headers: authHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          utr_reference: payload.utr_reference,
          payment_method: 'bank_transfer',
          ...(payload.amount !== undefined ? { amount: payload.amount } : {}),
        }),
      }
    );

    if (!response) {
      throw new Error('Empty response received from server');
    }

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.PAY_PAYOUT}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    yield put(showNotification({
      message: 'Payout recorded successfully',
      severity: 'success',
    }));

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PAYOUTS}_${SagaActionType.REQUEST}`,
      payload: {},
    });

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PAYOUTS_SUMMARY}_${SagaActionType.REQUEST}`,
      payload: {},
    });

  } catch (error: any) {
    console.error('❌ Pay payout failed:', error);

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.PAY_PAYOUT}_${SagaActionType.FAIL}`,
      payload: error?.message || 'Failed to record payout',
    });

    yield put(showNotification({
      message: error?.message || 'Failed to record payout',
      severity: 'error',
    }));
  }
}

export function* updatePayoutStatusWorker({
  payload,
}: updatePayoutStatusPayload
): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  try {
    const endpoint = `${API_ENDPOINTS.PAYOUTS.UPDATE_STATUS}/${encodeURIComponent(payload.payoutId)}/status`;

    const response = yield call(
      apiRequest,
      endpoint,
      {
        method: 'PATCH',
        headers: authHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          status: payload.status,
          ...(payload.utr_reference ? { utr_reference: payload.utr_reference } : {}),
        }),
      }
    );

    if (!response) {
      throw new Error('Empty response received from server');
    }

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.PAYOUT_STATUS}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    yield put(showNotification({
      message: 'Payout status updated',
      severity: 'success',
    }));

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PAYOUTS}_${SagaActionType.REQUEST}`,
      payload: {},
    });

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PAYOUTS_SUMMARY}_${SagaActionType.REQUEST}`,
      payload: {},
    });

  } catch (error: any) {
    console.error('❌ Update payout status failed:', error);

    yield put({
      type: `${SagaActions.PATCH}_${SagaActions.PAYOUT_STATUS}_${SagaActionType.FAIL}`,
      payload: error?.message || 'Failed to update payout status',
    });

    yield put(showNotification({
      message: error?.message || 'Failed to update payout status',
      severity: 'error',
    }));
  }
}

export function* exportPayoutsWorker(): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  yield put({ type: `${SagaActions.CLEAR}_${SagaActions.EXPORT_PAYOUTS}` });

  try {
    const endpoint = API_ENDPOINTS.PAYOUTS.EXPORT;

    const blob = yield call(apiRequest, endpoint, {
      method: 'GET',
      headers: authHeaders(),
      credentials: 'include',
      isBinary: true,
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'payouts.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.EXPORT_PAYOUTS}_${SagaActionType.SUCCESS}`,
      payload: true,
    });

  } catch (error: any) {
    console.error('❌ Payouts export failed:', error);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.EXPORT_PAYOUTS}_${SagaActionType.FAIL}`,
      payload: error?.message || 'Failed to export payouts',
    });

    yield put(showNotification({
      message: error?.message || 'Failed to export payouts',
      severity: 'error',
    }));
  }
}

export function* exportRazorpaySettlementsWorker(): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  yield put({ type: `${SagaActions.CLEAR}_${SagaActions.EXPORT_RAZORPAY_SETTLEMENTS}` });

  try {
    const endpoint = API_ENDPOINTS.PAYOUTS.EXPORT_RAZORPAY_SETTLEMENTS;

    const blob = yield call(apiRequest, endpoint, {
      method: 'GET',
      headers: authHeaders(),
      credentials: 'include',
      isBinary: true,
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'razorpay-settlements.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.EXPORT_RAZORPAY_SETTLEMENTS}_${SagaActionType.SUCCESS}`,
      payload: true,
    });

  } catch (error: any) {
    console.error('❌ Razorpay settlements export failed:', error);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.EXPORT_RAZORPAY_SETTLEMENTS}_${SagaActionType.FAIL}`,
      payload: error?.message || 'Failed to export razorpay settlements',
    });

    yield put(showNotification({
      message: error?.message || 'Failed to export razorpay settlements',
      severity: 'error',
    }));
  }
}

// Watcher functions

function* payoutsWatcher() {
  yield takeLatest(
    `${SagaActions.FETCH}_${SagaActions.PAYOUTS}_${SagaActionType.REQUEST}`,
    fetchPayouts
  );
}

function* payoutsSummaryWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.PAYOUTS_SUMMARY}_${SagaActionType.REQUEST}`,
    fetchPayoutsSummary
  );
}

function* razorpaySettlementsWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.RAZORPAY_SETTLEMENTS}_${SagaActionType.REQUEST}`,
    fetchRazorpaySettlements
  );
}

function* payPayoutWatcher() {
  yield takeEvery(
    `${SagaActions.PATCH}_${SagaActions.PAY_PAYOUT}_${SagaActionType.REQUEST}`,
    payPayoutWorker
  );
}

function* updatePayoutStatusWatcher() {
  yield takeEvery(
    `${SagaActions.PATCH}_${SagaActions.PAYOUT_STATUS}_${SagaActionType.REQUEST}`,
    updatePayoutStatusWorker
  );
}

function* exportPayoutsWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.EXPORT_PAYOUTS}_${SagaActionType.REQUEST}`,
    exportPayoutsWorker
  );
}

function* exportRazorpaySettlementsWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.EXPORT_RAZORPAY_SETTLEMENTS}_${SagaActionType.REQUEST}`,
    exportRazorpaySettlementsWorker
  );
}

// Root payouts saga
export default function* rootPayoutsSaga() {
  yield spawn(payoutsWatcher);
  yield spawn(payoutsSummaryWatcher);
  yield spawn(razorpaySettlementsWatcher);
  yield spawn(payPayoutWatcher);
  yield spawn(updatePayoutStatusWatcher);
  yield spawn(exportPayoutsWatcher);
  yield spawn(exportRazorpaySettlementsWatcher);
}
