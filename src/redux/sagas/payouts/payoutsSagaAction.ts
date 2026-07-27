import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../index";

// Payload interfaces for saga actions
export interface getPayoutsPayload {
  payload: {
    status?: string;
    search?: string;
    from?: string;
    to?: string;
    provider?: string;
  };
  type: string;
}

export interface getSummaryPayload {
  payload: {};
  type: string;
}

export interface getRazorpaySettlementsPayload {
  payload: {
    count?: number;
  };
  type: string;
}

export interface payPayoutPayload {
  payload: {
    pharmacyId: string;
    utr_reference: string;
    amount?: number;
  };
  type: string;
}

export interface updatePayoutStatusPayload {
  payload: {
    payoutId: string;
    status: string;
    utr_reference?: string;
  };
  type: string;
}

export const getPayouts = createAction(
  `${SagaActions.FETCH}_${SagaActions.PAYOUTS}_${SagaActionType.REQUEST}`,
  function prepare(payload?: getPayoutsPayload["payload"]) {
    return {
      payload: payload,
    };
  }
);

export const getPayoutsSummary = createAction(
  `${SagaActions.FETCH}_${SagaActions.PAYOUTS_SUMMARY}_${SagaActionType.REQUEST}`,
  function prepare(payload?: getSummaryPayload["payload"]) {
    return {
      payload: payload,
    };
  }
);

export const getRazorpaySettlements = createAction(
  `${SagaActions.FETCH}_${SagaActions.RAZORPAY_SETTLEMENTS}_${SagaActionType.REQUEST}`,
  function prepare(payload?: getRazorpaySettlementsPayload["payload"]) {
    return {
      payload: payload,
    };
  }
);

export const payPayout = createAction(
  `${SagaActions.PATCH}_${SagaActions.PAY_PAYOUT}_${SagaActionType.REQUEST}`,
  function prepare(payload: payPayoutPayload["payload"]) {
    return {
      payload: payload,
    };
  }
);

export const updatePayoutStatus = createAction(
  `${SagaActions.PATCH}_${SagaActions.PAYOUT_STATUS}_${SagaActionType.REQUEST}`,
  function prepare(payload: updatePayoutStatusPayload["payload"]) {
    return {
      payload: payload,
    };
  }
);

export const exportPayouts = createAction(
  `${SagaActions.FETCH}_${SagaActions.EXPORT_PAYOUTS}_${SagaActionType.REQUEST}`
);

export const exportRazorpaySettlements = createAction(
  `${SagaActions.FETCH}_${SagaActions.EXPORT_RAZORPAY_SETTLEMENTS}_${SagaActionType.REQUEST}`
);
