import { createAction, props } from "@ngrx/store";
import { SearchInput } from "./search-input.reducer";

export const saveSearchInput = createAction(
	"[Search] Save Input",
	props<{ searchInput: SearchInput }>(),
);

export const saveTermInput = createAction(
	"[Search] Save Term Input",
	props<{ termName: string }>(),
);
