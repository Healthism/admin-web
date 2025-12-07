import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../index";

// Payload interfaces for saga actions
export interface getTransactionsPayload {
  payload: {
    type: string;
    date_to?: string;
    date_from?: string;
    status?: string;
    search?: string;
    payment_status?: string;
  };
  type: string;
}

export interface getInvoicePayload {
  payload: {
    orderId: string;
  };
  type: string;
}

export interface transactionGraphPayload {
  payload: {
    type: string;
  };
  type: string;
}

export interface exportPayload {
  payload: {};
  type: string;
}

export const getTransactions = createAction(
  `${SagaActions.FETCH}_${SagaActions.TRANSACTIONS}_${SagaActionType.REQUEST}`,
  function prepare(payload?: getTransactionsPayload["payload"]) {
    return {
      payload: payload,
    };
  }
);

export const getInvoice = createAction(
  `${SagaActions.FETCH}_${SagaActions.INVOICE}_${SagaActionType.REQUEST}`,
  function prepare(payload?: getInvoicePayload["payload"]) {
    return {
      payload: payload,
    };
  }
);

export const getExport = createAction(
  `${SagaActions.FETCH}_${SagaActions.EXPORT}_${SagaActionType.REQUEST}`,
  function prepare(payload?: exportPayload["payload"]) {
    return {
      payload: payload,
    };
  }
);

export const getTransactionGraphData = createAction(
  `${SagaActions.FETCH}_${SagaActions.TRANSACTIONS_GRAPH}_${SagaActionType.REQUEST}`,
  function prepare(payload?: transactionGraphPayload["payload"]) {
    return {
      payload: payload,
    };
  }
);


