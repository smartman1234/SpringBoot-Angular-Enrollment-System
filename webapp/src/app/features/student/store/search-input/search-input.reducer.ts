import { Action, createReducer, on } from "@ngrx/store";
import { saveSearchInput, saveTermInput } from "./search-input.actions";
import { meetingDayQuery } from "../../constant/search-field-query";
import { QueryParamOperator } from "../../../../core/constants/query-param-operator.enum";
import { SearchMode } from "../../constant/search-mode";

export interface SearchInput {
	term: string,
	subject: string,
	courseName: string,
	courseNumber: string,
	courseNumberQuery: string,
	sectionStatusOpen: boolean,
	meetingTimeStart: string,
	meetingTimeStart2: string,
	meetingTimeStartQuery: string,
	meetingTimeEnd: string,
	meetingTimeEnd2: string,
	meetingTimeEndQuery: string,
	meetingDays: {
		monday: boolean,
		tuesday: boolean,
		wednesday: boolean,
		thursday: boolean,
		friday: boolean,
		saturday: boolean,
		sunday: boolean,
	},
	meetingDayQuery: string,
	instructorLastName: string,
	instructorLastNameQuery: string,
	unit: string,
	unitQuery: string,
	searchMode: string,
	page: number,
	size: number,
	sort: string,
}

export const initialSearchInputState: SearchInput = {
	term: "",
	subject: "",
	courseName: "",
	courseNumber: "",
	courseNumberQuery: QueryParamOperator.EQUALS,
	sectionStatusOpen: true,
	meetingTimeStart: "",
	meetingTimeStart2: "",
	meetingTimeStartQuery: QueryParamOperator.GREATER_THAN_OR_EQUAL,
	meetingTimeEnd: "",
	meetingTimeEnd2: "",
	meetingTimeEndQuery: QueryParamOperator.GREATER_THAN_OR_EQUAL,
	meetingDays: {
		monday: false,
		tuesday: false,
		wednesday: false,
		thursday: false,
		friday: false,
		saturday: false,
		sunday: false,
	},
	meetingDayQuery: meetingDayQuery.includeOnly,
	instructorLastName: "",
	instructorLastNameQuery: QueryParamOperator.STARTS_WITH_IGNORE_CASE,
	unit: "",
	unitQuery: QueryParamOperator.GREATER_THAN_OR_EQUAL,
	searchMode: SearchMode.LIST,
	page: 0,
	size: 20,
	sort: "",
};

const reducer = createReducer(
	initialSearchInputState,
	on(saveSearchInput, (state, { searchInput }) => ({ ...searchInput })),
	on(saveTermInput, (state, { termName }) => ({ ...state, term: termName })),
);

export function searchInputReducer(state: SearchInput | undefined, action: Action) {
	return reducer(state, action);
}

