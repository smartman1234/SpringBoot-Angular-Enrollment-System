import { createAction } from "@ngrx/store";

export const loadingOn = createAction("[Loading] Loading On");

export const loadingOff = createAction("[Loading] Loading Off");

export const increaseRequest = createAction("[Loading] Increase Request");

export const decreaseRequest = createAction("[Loading] Decrease Request");
