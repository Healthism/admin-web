import {
  put,
  call,
  spawn,
  takeEvery,
  type CallEffect,
  type PutEffect,
} from 'redux-saga/effects';
import { SagaActionType, SagaActions } from '../index';
import type { getFeedbackPayload, getWaitlistPayload, exportFeedbackPayload, exportWaitlistPayload } from './feedbackSagaAction';
import type { AnyAction } from 'redux-saga';
import API_ENDPOINTS, { apiRequest } from '../../../config/api.config';

export function* fetchFeedback({
  payload,
}: getFeedbackPayload): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.FEEDBACK}`,
  });

  try {
    const endpoint = API_ENDPOINTS.FEEDBACK.GET_FEEDBACK;
    const params: string[] = [];

    if (payload?.rating) {
      params.push(`rating=${payload.rating}`);
    }
    if (payload?.source) {
      params.push(`source=${encodeURIComponent(payload.source)}`);
    }
    if (payload?.days) {
      params.push(`days=${payload.days}`);
    }

    const endpointWithQuery = params.length > 0
      ? `${endpoint}?${params.join('&')}`
      : endpoint;

    const response = yield call(apiRequest, endpointWithQuery, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    if (!response) {
      throw new Error('Empty response received from server');
    }

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.FEEDBACK}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    console.error('Feedback fetch failed:', error);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.FEEDBACK}_${SagaActionType.FAIL}`,
      payload: error?.message || 'Failed to fetch feedback data',
    });
  }
}

export function* fetchWaitlist({
  payload,
}: getWaitlistPayload): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.WAITLIST}`,
  });

  try {
    const endpoint = API_ENDPOINTS.FEEDBACK.GET_WAITLIST;
    const params: string[] = [];

    if (payload?.role) {
      params.push(`role=${encodeURIComponent(payload.role)}`);
    }
    if (payload?.search) {
      params.push(`search=${encodeURIComponent(payload.search)}`);
    }

    const endpointWithQuery = params.length > 0
      ? `${endpoint}?${params.join('&')}`
      : endpoint;

    const response = yield call(apiRequest, endpointWithQuery, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    if (!response) {
      throw new Error('Empty response received from server');
    }

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.WAITLIST}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    console.error('Waitlist fetch failed:', error);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.WAITLIST}_${SagaActionType.FAIL}`,
      payload: error?.message || 'Failed to fetch waitlist data',
    });
  }
}

export function* fetchExportFeedback({
  payload,
}: exportFeedbackPayload): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  try {
    const endpoint = API_ENDPOINTS.FEEDBACK.EXPORT_FEEDBACK;

    const blob: Blob = yield call(apiRequest, endpoint, {
      method: 'GET',
      isBinary: true,
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'feedback.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.EXPORT_FEEDBACK}_${SagaActionType.SUCCESS}`,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.EXPORT_FEEDBACK}_${SagaActionType.FAIL}`,
      payload: error?.message || 'Failed to export feedback',
    });
  }
}

export function* fetchExportWaitlist({
  payload,
}: exportWaitlistPayload): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  try {
    const endpoint = API_ENDPOINTS.FEEDBACK.EXPORT_WAITLIST;
    const params: string[] = [];

    if (payload?.role) {
      params.push(`role=${encodeURIComponent(payload.role)}`);
    }

    const endpointWithQuery = params.length > 0
      ? `${endpoint}?${params.join('&')}`
      : endpoint;

    const blob: Blob = yield call(apiRequest, endpointWithQuery, {
      method: 'GET',
      isBinary: true,
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'waitlist.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.EXPORT_WAITLIST}_${SagaActionType.SUCCESS}`,
    });
  } catch (error: any) {
    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.EXPORT_WAITLIST}_${SagaActionType.FAIL}`,
      payload: error?.message || 'Failed to export waitlist',
    });
  }
}

function* feedbackWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.FEEDBACK}_${SagaActionType.REQUEST}`,
    fetchFeedback,
  );
}

function* waitlistWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.WAITLIST}_${SagaActionType.REQUEST}`,
    fetchWaitlist,
  );
}

function* exportFeedbackWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.EXPORT_FEEDBACK}_${SagaActionType.REQUEST}`,
    fetchExportFeedback,
  );
}

function* exportWaitlistWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.EXPORT_WAITLIST}_${SagaActionType.REQUEST}`,
    fetchExportWaitlist,
  );
}

export default function* rootFeedbackSaga() {
  yield spawn(feedbackWatcher);
  yield spawn(waitlistWatcher);
  yield spawn(exportFeedbackWatcher);
  yield spawn(exportWaitlistWatcher);
}
