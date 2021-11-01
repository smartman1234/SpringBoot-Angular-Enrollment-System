import { createAction, props } from "@ngrx/store";
import { Section } from "../../models/section.model";
import { SearchInput } from "../search-input/search-input.reducer";
import { Page } from "../../../../core/models/page.model";
import { Slice } from "../../../../core/models/slice.model";

export const getSections = createAction(
	"[Section] Get Sections",
	props<{ searchInput: SearchInput }>(),
);

export const getSectionsSuccess = createAction(
	"[Section] Get Sections Success",
	props<{ sections: Array<Section> }>(),
);

export const getSectionPage = createAction(
	"[Section] Get Section Page",
	props<{ searchInput: SearchInput }>(),
);

export const getSectionPageSuccess = createAction(
	"[Section] Get Section Page Success",
	props<{ pageSection: Page<Section> }>(),
);

export const getSectionSlice = createAction(
	"[Section] Get Section Slice",
	props<{ searchInput: SearchInput }>(),
);

export const getSectionSliceSuccess = createAction(
	"[Section] Get Section Slice Success",
	props<{ sliceSection: Slice<Section> }>(),
);
