import { createAction } from '@reduxjs/toolkit';
import { SagaActions, SagaActionType } from '../index';

export interface getUsersPayload {
  payload: {
    type: string;
    search?: string;
    status?: string;
  };
  type: string;
}

export interface getExportUsersPayload {
  payload: {
    type: string;
  };
  type: string;
}

export interface toggleUserStatusPayload {
  payload: {
    userId: string;
    type: string;
    action: 'suspend' | 'activate';
    reason: string;
    duration_days?: number;
  };
  type: string;
}

export const getUsers = createAction(
  `${SagaActions.FETCH}_${SagaActions.USERS}_${SagaActionType.REQUEST}`,
  function prepare(payload?: getUsersPayload['payload']) {
    return { payload };
  },
);

export const getExportUsers = createAction(
  `${SagaActions.FETCH}_${SagaActions.EXPORT_USERS}_${SagaActionType.REQUEST}`,
  function prepare(payload?: getExportUsersPayload['payload']) {
    return { payload };
  },
);

export const toggleUserStatus = createAction(
  `${SagaActions.PATCH}_${SagaActions.TOGGLE_USER_STATUS}_${SagaActionType.REQUEST}`,
  function prepare(payload?: toggleUserStatusPayload['payload']) {
    return { payload };
  },
);
