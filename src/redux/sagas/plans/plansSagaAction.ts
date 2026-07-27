import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../index";

export interface getPlansPayload {
  payload: {};
  type: string;
}

export interface createPlanPayload {
  payload: {
    name: string;
    plan_type: string;
    price: number;
    max_orders_allowed: number;
    duration_days: number;
    features: string[];
    description: string;
  };
  type: string;
}

export interface updatePlanPayload {
  payload: {
    _id: string;
    price?: number;
    max_orders_allowed?: number;
    features?: string[];
    description?: string;
    name?: string;
    plan_type?: string;
    duration_days?: number;
  };
  type: string;
}

export interface deletePlanPayload {
  payload: {
    _id: string;
  };
  type: string;
}

export interface getPlanAnalyticsPayload {
  payload: {
    period?: string;
    from?: string;
    to?: string;
  };
  type: string;
}

export const getPlans = createAction(
  `${SagaActions.FETCH}_${SagaActions.PLANS}_${SagaActionType.REQUEST}`,
  function prepare(payload?: getPlansPayload["payload"]) {
    return {
      payload: payload,
    };
  }
);

export const createPlan = createAction(
  `${SagaActions.SEND}_${SagaActions.PLAN}_${SagaActionType.REQUEST}`,
  function prepare(payload: createPlanPayload["payload"]) {
    return {
      payload: payload,
    };
  }
);

export const updatePlan = createAction(
  `${SagaActions.UPDATE}_${SagaActions.PLAN}_${SagaActionType.REQUEST}`,
  function prepare(payload: updatePlanPayload["payload"]) {
    return {
      payload: payload,
    };
  }
);

export const deletePlan = createAction(
  `${SagaActions.DELETE}_${SagaActions.PLAN}_${SagaActionType.REQUEST}`,
  function prepare(payload: deletePlanPayload["payload"]) {
    return {
      payload: payload,
    };
  }
);

export const getPlanAnalytics = createAction(
  `${SagaActions.FETCH}_${SagaActions.PLAN_ANALYTICS}_${SagaActionType.REQUEST}`,
  function prepare(payload?: getPlanAnalyticsPayload["payload"]) {
    return {
      payload: payload,
    };
  }
);
