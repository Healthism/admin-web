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
import type { getUsersPayload } from "./userSagaAction";
import type { AnyAction } from "redux-saga";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";

// API: AUTH
export function* fetchUsers({
  payload,
}: getUsersPayload): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  // const token = getAuthToken();
  
  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.USERS}`,
  });
  
  
  try {
    
    const endpoint = API_ENDPOINTS.USERS.GET_USERS;
    const endpointWithQuery = payload?.type ? `${endpoint}?type=${encodeURIComponent(payload.type)}` : endpoint;

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
      type: `${SagaActions.FETCH}_${SagaActions.USERS}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
    
    
  } catch (error: any) {
    console.error('❌ Users fetch failed:', error);
    
    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.USERS}_${SagaActionType.FAIL}`,
      payload: error?.message || 'Failed to fetch users data',
    });
    
    console.error('🔴 Dispatched FETCH_FAIL action with error:', error?.message);
  }
}
// Watcher functions

function* usersWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.USERS}_${SagaActionType.REQUEST}`,
    fetchUsers
  );
}

// Root auth saga
export default function* rootUsersSaga() {
  yield spawn(usersWatcher);
}
