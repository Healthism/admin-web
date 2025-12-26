import { createAction } from "@reduxjs/toolkit";
import { SagaActions, SagaActionType } from "../index";

// Payload interfaces for saga actions

export interface getProfilePayload {
  payload: {};
  type: string;
}

export const getProfile = createAction(
  `${SagaActions.FETCH}_${SagaActions.PROFILE}_${SagaActionType.REQUEST}`,
  function prepare(payload?: getProfilePayload["payload"]) {
    return {
      payload: payload,
    };
  }
);
