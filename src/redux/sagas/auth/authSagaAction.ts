import { createAction } from '@reduxjs/toolkit';
import { SagaActions, SagaActionType } from '../index';

// Payload interfaces for saga actions
export interface PostLoginPayload {
  payload: {
  username: string;
  password: string;
  }

  type: string;}


export const postLoginAdmin = createAction(
  `${SagaActions.LOGIN_ADMIN}_${SagaActionType.REQUEST}`,
  function prepare(payload?: PostLoginPayload['payload']) {
    return {
      payload: payload,
    };
  },
);