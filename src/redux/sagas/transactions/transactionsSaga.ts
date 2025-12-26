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
import type { exportPayload, getInvoicePayload, getTransactionsPayload, transactionGraphPayload } from "./transactionsSagaAction";
import type { AnyAction } from "redux-saga";
import API_ENDPOINTS, { apiRequest } from "../../../config/api.config";
import { showNotification } from "../../../redux/slices/notificationSlice";

// API: TRANSACTIONS

export function* fetchTransactions({
  payload,
}: getTransactionsPayload
): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  
  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.TRANSACTIONS}`,
  });
  
  try {
    
    const endpoint = API_ENDPOINTS.TRANSACTIONS.GET_TRANSACTIONS;
    
    // Build query parameters properly
    const queryParams: string[] = [];
    
    if (payload?.type) {
      queryParams.push(`type=${encodeURIComponent(payload.type)}`);
    }

    if (payload?.payment_status) {
      queryParams.push(`payment_status=${encodeURIComponent(payload.payment_status)}`);
    }
    if (payload?.date_from) {
      queryParams.push(`date_from=${encodeURIComponent(payload.date_from)}`);
    }
    if (payload?.date_to) {
      queryParams.push(`date_to=${encodeURIComponent(payload.date_to)}`);
    } 
    if (payload?.search) {
      queryParams.push(`search=${encodeURIComponent(payload.search)}`);
    }
    
    // Construct final endpoint with query string
    const endpointWithQuery = queryParams.length > 0 
      ? `${endpoint}?${queryParams.join('&')}` 
      : endpoint;
    

    const response = yield call(
      apiRequest,
      endpointWithQuery,
      {
        method: 'GET',
        headers: {
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
      type: `${SagaActions.FETCH}_${SagaActions.TRANSACTIONS}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
    
  } catch (error: any) {
    console.error('❌ Transactions fetch failed:', error);
    
    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.TRANSACTIONS}_${SagaActionType.FAIL}`,
      payload: error?.message || 'Failed to fetch transactions data',
    });
  }
}

export function* fetchInvoice({
  payload,
}: getInvoicePayload
): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  
  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.INVOICE}`,
  });
  
  try {
    
    const endpoint = API_ENDPOINTS.TRANSACTIONS.GET_INVOICE;
    
  
    
    // Construct final endpoint with query string
       const endpointWithQuery = payload?.orderId
      ? `${endpoint}/${encodeURIComponent(payload.orderId)}`
      : endpoint;
    

    const response = yield call(
      apiRequest,
      endpointWithQuery,
      {
        method: 'GET',
        headers: {
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
      type: `${SagaActions.FETCH}_${SagaActions.INVOICE}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
    
  } catch (error: any) {
    console.error('❌ Invoice fetch failed:', error);
    
    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.INVOICE}_${SagaActionType.FAIL}`,
      payload: error?.message || 'Failed to fetch invoice data',
    });
  }
}


export function* fetchTransactionGraphData({
  payload,
}: transactionGraphPayload
): Generator<CallEffect<any> | PutEffect<AnyAction>, void, any> {
  
  yield put({
    type: `${SagaActions.CLEAR}_${SagaActions.TRANSACTIONS_GRAPH}`,
  });
  
  try {
    
    const endpoint = API_ENDPOINTS.TRANSACTIONS.GET_TRANSACTION_GRAPH;
    
       const endpointWithQuery = payload?.type
      ? `${endpoint}?type=${encodeURIComponent(payload.type)}`
      : endpoint;
    

    const response = yield call(
      apiRequest,
      endpointWithQuery,
      {
        method: 'GET',
        headers: {
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
      type: `${SagaActions.FETCH}_${SagaActions.TRANSACTIONS_GRAPH}_${SagaActionType.SUCCESS}`,
      payload: response,
    });
    
  } catch (error: any) {
    console.error('❌ Invoice fetch failed:', error);
    
    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.TRANSACTIONS_GRAPH}_${SagaActionType.FAIL}`,
      payload: error?.message || 'Failed to fetch transaction graph data',
    });
  }
}


export function* fetchExportData({ payload }: exportPayload) {
  yield put({ type: `${SagaActions.CLEAR}_${SagaActions.EXPORT}` });

  try {
    const endpoint = API_ENDPOINTS.TRANSACTIONS.EXPORT;

    // GET FILE AS BLOB
    const blob: Blob = yield call(apiRequest, endpoint, {
      method: "GET",
      isBinary: true,       // <--- VERY IMPORTANT
    });

    // Create file download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.xlsx";
    link.click();
    window.URL.revokeObjectURL(url);

    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.EXPORT}_${SagaActionType.SUCCESS}`,
      payload: true,
    });

  } catch (error: any) {
    yield put({
      type: `${SagaActions.FETCH}_${SagaActions.EXPORT}_${SagaActionType.FAIL}`,
      payload: error.message,
    });

    yield put(showNotification({
      message: error.message,
      severity: "error"
    }));
  }
}
// Watcher functions

function* transactionsWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.TRANSACTIONS}_${SagaActionType.REQUEST}`,
    fetchTransactions
  );
}

function* invoiceWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.INVOICE}_${SagaActionType.REQUEST}`,
    fetchInvoice
  );
}

function* exportWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.EXPORT}_${SagaActionType.REQUEST}`,
    fetchExportData
  );
}

function* transactionGraphWatcher() {
  yield takeEvery(
    `${SagaActions.FETCH}_${SagaActions.TRANSACTIONS_GRAPH}_${SagaActionType.REQUEST}`,
    fetchTransactionGraphData
  );
}

// Root auth saga
export default function* rootTransactionsSaga() {
  yield spawn(transactionsWatcher);
  yield spawn(invoiceWatcher);
  yield spawn(exportWatcher);
  yield spawn(transactionGraphWatcher);
}
