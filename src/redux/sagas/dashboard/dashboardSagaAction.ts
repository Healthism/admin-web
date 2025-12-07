import { createAction } from '@reduxjs/toolkit';
import { SagaActions, SagaActionType } from '../index';

// Payload interfaces for saga actions
export interface getDashboardPayload {
  payload: {}
  type: string;}


export const getDashboardData = createAction(
  `${SagaActions.FETCH}_${SagaActions.DASHBOARD}_${SagaActionType.REQUEST}`,
  function prepare(payload?: getDashboardPayload['payload']) {
    return {
      payload: payload,
    };
  },
);