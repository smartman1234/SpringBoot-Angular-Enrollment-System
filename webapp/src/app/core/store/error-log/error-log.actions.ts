import { createAction, props } from '@ngrx/store';

export const addErrorLog = createAction(
  '[ErrorLog] Add Error Log',
  props<{ error: any }>()
);

export const updateErrorLogs = createAction(
	'[ErrorLog] Update Error Logs',
	props<{ errors: any[] }>()
);

export const resetErrorLogs = createAction('[ErrorLog] Reset Error Logs');
