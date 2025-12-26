import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../index";

// Payload interfaces for saga actions
export interface getPromoCodesPayload {
  payload: {};
  type: string;
}

export interface getPromoCodePayload {
    payload: {
    _id: string;
  };
  type: string;
}

export interface deletePromoCodesPayload {
  payload: {
    _id: string;
  };
  type: string;
}

export interface postPromoCodesPayload {
  payload: {
    code: string;
    discountType: string;
    discountValue: number;
    minOrderValue: number;
    maxUsers: number;
    startDate: string;
    endDate: string;
    active: boolean;
  };
  type: string;
}
export interface updatePromoCodePayload {
  _id: string;
  payload: {
    _id?: string;
    code?: string;
    discountType?: string;
    discountValue?: number;
    minOrderValue?: number;
    maxUsers?: number;
    startDate?: string;
    endDate?: string;
    active?: boolean;
  };
  type: string;
}

export const getPromoCodes = createAction(
  `${SagaActions.FETCH}_${SagaActions.PROMO_CODES}_${SagaActionType.REQUEST}`,
  function prepare(payload?: getPromoCodesPayload["payload"]) {
    return {
      payload: payload,
    };
  }
);

export const getPromoCodeById = createAction(
  `${SagaActions.FETCH}_${SagaActions.PROMO_CODE}_${SagaActionType.REQUEST}`,
  function prepare(payload?: getPromoCodePayload["payload"]) {
    return {
      payload: payload,
    };
  }
);

export const updatePromoCode = createAction(
  `${SagaActions.UPDATE}_${SagaActions.PROMO_CODE}_${SagaActionType.REQUEST}`,
  function prepare(payload?: updatePromoCodePayload["payload"]) {
    return {
      payload: payload,
    };
  }
);

export const createPromoCode = createAction(
  `${SagaActions.SEND}_${SagaActions.PROMO_CODES}_${SagaActionType.REQUEST}`,
  function prepare(payload?: postPromoCodesPayload["payload"]) {
    return {
      payload: payload,
    };
  }
);

export const deletePromoCode = createAction(
  `${SagaActions.DELETE}_${SagaActions.PROMO_CODES}_${SagaActionType.REQUEST}`,
  function prepare(payload?: deletePromoCodesPayload["payload"]) {
    return {
      payload: payload,
    };
  }
);
