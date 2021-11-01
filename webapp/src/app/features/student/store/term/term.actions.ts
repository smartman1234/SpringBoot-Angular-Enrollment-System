import { createAction, props } from "@ngrx/store";
import { Term } from "../../models/term.model";

export const getAllTerms = createAction("[Term] Get All");

export const getAllTermsSuccess = createAction(
	"[Term] Get All Success",
	props<{ terms: Term[] }>(),
);
