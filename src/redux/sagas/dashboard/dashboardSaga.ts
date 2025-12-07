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
import type { getDashboardPayload } from "./dashboardSagaAction";
import type { AnyAction } from "redux-saga";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";

// API: DASHBOARD
export function* fetchDashboardData({
  payload,
}: getDashboardPayload
): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  // const token = getAuthToken();
  
  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.DASHBOARD}`,
  });
  
  
  try {
    
    const endpoint = API_ENDPOINTS.DASHBOARD.GET_DASHBOARD_DATA;
    const endpointWithQuery =  endpoint;

    const response = yield call(
      apiRequest,
      endpointWithQuery,
      {
        method: 'GET',
        headers: {
            // 'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
       credentials: 'include' 
      }
    );
    
    
    if (!response) {
      throw new Error('Empty response received from server');
    }
    
    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.DASHBOARD}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
    
    
  } catch (error: any) {
    console.error('❌ Users fetch failed:', error);
    
    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.DASHBOARD}_${SagaActionType.FAIL}`,
      payload: error?.message || 'Failed to fetch dashboard data',
    });
    
    console.error('🔴 Dispatched FETCH_FAIL action with error:', error?.message);
  }
}
// Watcher functions

function* dashboardWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.DASHBOARD}_${SagaActionType.REQUEST}`,
    fetchDashboardData
  );
}

// Root auth saga
export default function* rootDashboardSaga() {
  yield spawn(dashboardWatcher);
}
