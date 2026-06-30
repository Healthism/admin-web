import { createAction } from '@reduxjs/toolkit';
import { SagaActions, SagaActionType } from '../index';

export interface getFeedbackPayload {
  payload: {
    rating?: number;
    source?: string;
    days?: number;
  };
  type: string;
}

export interface getWaitlistPayload {
  payload: {
    role?: string;
    search?: string;
  };
  type: string;
}

export const getFeedback = createAction(
  `${SagaActions.FETCH}_${SagaActions.FEEDBACK}_${SagaActionType.REQUEST}`,
  function prepare(payload?: getFeedbackPayload['payload']) {
    return { payload };
  },
);

export const getWaitlist = createAction(
  `${SagaActions.FETCH}_${SagaActions.WAITLIST}_${SagaActionType.REQUEST}`,
  function prepare(payload?: getWaitlistPayload['payload']) {
    return { payload };
  },
);

export interface exportFeedbackPayload {
  payload: {};
  type: string;
}

export interface exportWaitlistPayload {
  payload: {
    role?: string;
  };
  type: string;
}

export const exportFeedback = createAction(
  `${SagaActions.FETCH}_${SagaActions.EXPORT_FEEDBACK}_${SagaActionType.REQUEST}`,
  function prepare(payload?: exportFeedbackPayload['payload']) {
    return { payload };
  },
);

export const exportWaitlist = createAction(
  `${SagaActions.FETCH}_${SagaActions.EXPORT_WAITLIST}_${SagaActionType.REQUEST}`,
  function prepare(payload?: exportWaitlistPayload['payload']) {
    return { payload };
  },
);
