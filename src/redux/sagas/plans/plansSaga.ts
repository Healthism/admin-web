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
  getPlansPayload,
  createPlanPayload,
  updatePlanPayload,
  deletePlanPayload,
  getPlanAnalyticsPayload,
} from "./plansSagaAction";
import type { AnyAction } from "redux-saga";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { showNotification } from "../../slices/notificationSlice";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

export function* fetchPlans({
  payload,
}: getPlansPayload): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.PLANS}`,
  });

  try {
    const endpoint = API_ENDPOINTS.PLANS.GET_PLANS;

    const response = yield call(apiRequest, endpoint, {
      method: "GET",
      headers: authHeaders(),
      credentials: "include",
    });

    if (!response) {
      throw new Error("Empty response received from server");
    }

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PLANS}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    console.error("❌ Plans fetch failed:", error);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PLANS}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch plans",
    });

    yield put(showNotification({
      message: error?.message || "Failed to fetch plans",
      severity: "error",
    }));
  }
}

export function* createPlanWorker({
  payload,
}: createPlanPayload): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  try {
    const endpoint = API_ENDPOINTS.PLANS.CREATE_PLAN;

    const response = yield call(apiRequest, endpoint, {
      method: "POST",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response) {
      throw new Error("Empty response received from server");
    }

    yield put({
      type: `${SagaActions.SEND}_${SagaActions.PLAN}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    yield put(showNotification({
      message: response?.message || "Plan created successfully",
      severity: "success",
    }));

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PLANS}_${SagaActionType.REQUEST}`,
      payload: {},
    });
  } catch (error: any) {
    console.error("❌ Plan create failed:", error);

    yield put({
      type: `${SagaActions.SEND}_${SagaActions.PLAN}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to create plan",
    });

    yield put(showNotification({
      message: error?.message || "Failed to create plan",
      severity: "error",
    }));
  }
}

export function* updatePlanWorker({
  payload,
}: updatePlanPayload): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  try {
    const { _id, ...body } = payload;
    const endpoint = `${API_ENDPOINTS.PLANS.UPDATE_PLAN}/${encodeURIComponent(_id)}`;

    const response = yield call(apiRequest, endpoint, {
      method: "PUT",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (!response) {
      throw new Error("Empty response received from server");
    }

    yield put({
      type: `${SagaActions.UPDATE}_${SagaActions.PLAN}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    yield put(showNotification({
      message: response?.message || "Plan updated successfully",
      severity: "success",
    }));

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PLANS}_${SagaActionType.REQUEST}`,
      payload: {},
    });
  } catch (error: any) {
    console.error("❌ Plan update failed:", error);

    yield put({
      type: `${SagaActions.UPDATE}_${SagaActions.PLAN}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to update plan",
    });

    yield put(showNotification({
      message: error?.message || "Failed to update plan",
      severity: "error",
    }));
  }
}

export function* deletePlanWorker({
  payload,
}: deletePlanPayload): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  try {
    const endpoint = `${API_ENDPOINTS.PLANS.DELETE_PLAN}/${encodeURIComponent(payload._id)}`;

    const response = yield call(apiRequest, endpoint, {
      method: "DELETE",
      headers: authHeaders(),
      credentials: "include",
    });

    yield put({
      type: `${SagaActions.DELETE}_${SagaActions.PLAN}_${SagaActionType.SUCCESS}`,
      payload: response,
    });

    yield put(showNotification({
      message: response?.message || "Plan deleted successfully",
      severity: "success",
    }));

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PLANS}_${SagaActionType.REQUEST}`,
      payload: {},
    });
  } catch (error: any) {
    console.error("❌ Plan delete failed:", error);

    yield put({
      type: `${SagaActions.DELETE}_${SagaActions.PLAN}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to delete plan",
    });

    yield put(showNotification({
      message: error?.message || "Failed to delete plan",
      severity: "error",
    }));
  }
}

export function* fetchPlanAnalytics({
  payload,
}: getPlanAnalyticsPayload): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  try {
    const endpoint = API_ENDPOINTS.PLANS.GET_PLAN_ANALYTICS;

    const queryParams: string[] = [];
    if (payload?.from && payload?.to) {
      queryParams.push(`from=${encodeURIComponent(payload.from)}`);
      queryParams.push(`to=${encodeURIComponent(payload.to)}`);
    } else if (payload?.period) {
      queryParams.push(`period=${encodeURIComponent(payload.period)}`);
    }

    const endpointWithQuery = queryParams.length > 0
      ? `${endpoint}?${queryParams.join("&")}`
      : endpoint;

    const response = yield call(apiRequest, endpointWithQuery, {
      method: "GET",
      headers: authHeaders(),
      credentials: "include",
    });

    if (!response) {
      throw new Error("Empty response received from server");
    }

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PLAN_ANALYTICS}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
  } catch (error: any) {
    console.error("❌ Plan analytics fetch failed:", error);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.PLAN_ANALYTICS}_${SagaActionType.FAIL}`,
      payload: error?.message || "Failed to fetch plan analytics",
    });
  }
}

// Watcher functions

function* plansWatcher() {
  yield takeLatest(
    `${SagaActions.FETCH}_${SagaActions.PLANS}_${SagaActionType.REQUEST}`,
    fetchPlans
  );
}

function* createPlanWatcher() {
  yield takeEvery(
    `${SagaActions.SEND}_${SagaActions.PLAN}_${SagaActionType.REQUEST}`,
    createPlanWorker
  );
}

function* updatePlanWatcher() {
  yield takeEvery(
    `${SagaActions.UPDATE}_${SagaActions.PLAN}_${SagaActionType.REQUEST}`,
    updatePlanWorker
  );
}

function* deletePlanWatcher() {
  yield takeEvery(
    `${SagaActions.DELETE}_${SagaActions.PLAN}_${SagaActionType.REQUEST}`,
    deletePlanWorker
  );
}

function* planAnalyticsWatcher() {
  yield takeLatest(
    `${SagaActions.FETCH}_${SagaActions.PLAN_ANALYTICS}_${SagaActionType.REQUEST}`,
    fetchPlanAnalytics
  );
}

// Root plans saga
export default function* rootPlansSaga() {
  yield spawn(plansWatcher);
  yield spawn(createPlanWatcher);
  yield spawn(updatePlanWatcher);
  yield spawn(deletePlanWatcher);
  yield spawn(planAnalyticsWatcher);
}
