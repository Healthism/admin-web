import { createAction } from '@reduxjs/toolkit';
import { SagaActions, SagaActionType } from '../index';

// Payload interfaces for saga actions
export interface getUsersPayload {
  payload: {
  type: string;
  search?: string;
  status?: string;
  }
  type: string;}
  
  export interface getExportUsersPayload {
  payload: {
  type: string;

  }
  type: string;} 
  
  export interface suspendUsersPayload {
  payload: {
  userId: string;

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

export const getExportUsers = createAction(
  `${SagaActions.FETCH}_${SagaActions.EXPORT_USERS}_${SagaActionType.REQUEST}`,
  function prepare(payload?: getExportUsersPayload['payload']) {
    return {
      payload: payload,
    };
  },
);

export const suspendUsers = createAction(
  `${SagaActions.DELETE}_${SagaActions.SUSPEND_USERS}_${SagaActionType.REQUEST}`,
  function prepare(payload?: suspendUsersPayload['payload']) {
    return {
      payload: payload,
    };
  },
);