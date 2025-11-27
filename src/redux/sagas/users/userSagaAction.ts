import { createAction } from '@reduxjs/toolkit';
import { SagaActions, SagaActionType } from '../index';

// Payload interfaces for saga actions
export interface getUsersPayload {
  payload: {
  type: string;
  }
  type: string;}


export const getUsers = createAction(
  `${SagaActions.FETCH}_${SagaActions.USERS}_${SagaActionType.REQUEST}`,
  function prepare(payload?: getUsersPayload['payload']) {
    return {
      payload: payload,
    };
  },
);