import { QueryParamOperator } from "../../../core/constants/query-param-operator.enum";

export const courseNumberQuery = {
	[QueryParamOperator.LIKE_IGNORE_CASE]: "contains",
	[QueryParamOperator.GREATER_THAN_OR_EQUAL]: "greater than or equal to",
	[QueryParamOperator.EQUALS]: "is exactly",
	[QueryParamOperator.LESS_THAN_OR_EQUAL]: "less than or equal to",
};

export const meetingTimeQuery = {
	[QueryParamOperator.BETWEEN]: "between",
	[QueryParamOperator.GREATER_THAN]: "greater than",
	[QueryParamOperator.GREATER_THAN_OR_EQUAL]: "greater than or equal to",
	[QueryParamOperator.EQUALS]: "is exactly",
	[QueryParamOperator.LESS_THAN]: "less than",
	[QueryParamOperator.LESS_THAN_OR_EQUAL]: "less than or equal to",
};

export const meetingDayQuery = {
	excludeAny: "exclude any of these days",
	excludeOnly: "exclude only of these days",
	includeAny: "include any of these days",
	includeOnly: "include only of these days",
};

export const instructorLastNameQuery = {
	[QueryParamOperator.STARTS_WITH_IGNORE_CASE]: "begins with",
	[QueryParamOperator.LIKE_IGNORE_CASE]: "contains",
	[QueryParamOperator.EQUALS_IGNORE_CASE]: "is exactly",
};

export const unitQuery = {
	[QueryParamOperator.GREATER_THAN]: "greater than",
	[QueryParamOperator.GREATER_THAN_OR_EQUAL]: "greater than or equal to",
	[QueryParamOperator.EQUALS]: "is exactly",
	[QueryParamOperator.LESS_THAN]: "less than",
	[QueryParamOperator.LESS_THAN_OR_EQUAL]: "less than or equal to",
};

// export const courseNumberQuery = {
// 	contains: "contains",
// 	gte: "greater than or equal to",
// 	equals: "is exactly",
// 	lte: "less than or equal to",
// };
//
// export const meetingTimeQuery = {
// 	between: "between",
// 	gt: "greater than",
// 	gte: "greater than or equal to",
// 	equals: "is exactly",
// 	lt: "less than",
// 	lte: "less than or equal to",
// };
//
// export const meetingDayQuery = {
// 	excludeAny: "exclude any of these days",
// 	excludeOnly: "exclude only of these days",
// 	includeAny: "include any of these days",
// 	includeOnly: "include only of these days",
// };
//
// export const instructorLastNameQuery = {
// 	beginsWith: "begins with",
// 	contains: "contains",
// 	exact: "is exactly",
// };
//
// export const unitQuery = {
// 	gt: "greater than",
// 	gte: "greater than or equal to",
// 	equals: "is exactly",
// 	lt: "less than",
// 	lte: "less than or equal to",
// };
