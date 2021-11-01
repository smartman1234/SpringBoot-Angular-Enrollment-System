import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AbstractGenericCrudService } from "../../../core/services/generic-crud.service";
import { Section } from "../models/section.model";
import { Observable } from "rxjs";
import { Page } from "../../../core/models/page.model";
import { Slice } from "../../../core/models/slice.model";
import { meetingDayQuery } from "../constant/search-field-query";
import { QueryParamOperator } from "../../../core/constants/query-param-operator.enum";
import { SearchInput } from "../store/search-input/search-input.reducer";

interface QueryParams {
	[key: string]: string
}

@Injectable({
	providedIn: "root",
})
export class SectionService extends AbstractGenericCrudService<Section, string> {

	constructor(
		protected http: HttpClient,
	) {
		super(http, "/sections", {
			create: false,
			update: false,
			updatePartial: false,
			delete: false,
		});
	}

	getAll(searchInput: SearchInput): Observable<Array<Section>> {
		return this.readAll(this.buildQueryParams(searchInput));
	}

	getPage(searchInput: SearchInput): Observable<Page<Section>> {
		let httpParams = this.buildQueryParams(searchInput);
		httpParams = this.buildPaginationParams(searchInput, httpParams);

		return this.readPage(httpParams);
	}

	getSlice(searchInput: SearchInput): Observable<Slice<Section>> {
		let httpParams = this.buildQueryParams(searchInput);
		httpParams = this.buildPaginationParams(searchInput, httpParams);

		return this.readSlice(httpParams);
	}

	protected buildPaginationParams(searchInput: SearchInput, httpParams: HttpParams): HttpParams {
		httpParams = httpParams.append("size", searchInput.size);
		httpParams = httpParams.append("page", searchInput.page);
		if (searchInput.sort) {
			httpParams = httpParams.append("sort", searchInput.sort);
		}

		return httpParams;
	}

	protected buildQueryParams(searchInput: SearchInput): HttpParams {
		let queryParams: QueryParams = {};

		if (searchInput.term) {
			const key = `term.termName[${QueryParamOperator.EQUALS_IGNORE_CASE}]`;
			queryParams[key] = searchInput.term;
		}

		if (searchInput.subject) {
			const key = `course.subject.subjectAcronym[${QueryParamOperator.EQUALS_IGNORE_CASE}]`;
			queryParams[key] = searchInput.subject;
		}

		if (searchInput.courseName) {
			const key = `course.courseName[${QueryParamOperator.LIKE_IGNORE_CASE}]`;
			queryParams[key] = searchInput.courseName;
		}

		if (searchInput.courseNumber && searchInput.courseNumberQuery) {
			let key = "";
			switch (searchInput.courseNumberQuery) {
				case QueryParamOperator.LIKE_IGNORE_CASE:
					key = `course.courseCode[${searchInput.courseNumberQuery}]`;
					break;
				default:
					key = `course.courseNumber[${searchInput.courseNumberQuery}]`;
			}

			if (key !== "") {
				queryParams[key] = searchInput.courseNumber;
			}
		}

		if (searchInput.sectionStatusOpen) {
			const key = `sectionStatus[${QueryParamOperator.EQUALS_IGNORE_CASE}]`;
			queryParams[key] = "OPEN";
		}

		if (searchInput.meetingTimeStart && searchInput.meetingTimeStartQuery) {
			let key = `meetingTimeStart[${searchInput.meetingTimeStartQuery}]`;

			if (searchInput.meetingTimeStartQuery === QueryParamOperator.BETWEEN) {
				queryParams[key] = [searchInput.meetingTimeStart, searchInput.meetingTimeStart2].join(",");
			} else {
				queryParams[key] = searchInput.meetingTimeStart;
			}
		}

		if (searchInput.meetingTimeEnd && searchInput.meetingTimeEndQuery) {
			let key = `meetingTimeEnd[${searchInput.meetingTimeEndQuery}]`;

			if (searchInput.meetingTimeEndQuery === QueryParamOperator.BETWEEN) {
				queryParams[key] = [searchInput.meetingTimeEnd, searchInput.meetingTimeEnd2].join(",");
			} else {
				queryParams[key] = searchInput.meetingTimeEnd;
			}
		}

		if (searchInput.instructorLastName && searchInput.instructorLastNameQuery) {
			let key = `instructor.user.lastName[${searchInput.instructorLastNameQuery}]`;
			queryParams[key] = searchInput.instructorLastName;
		}

		if (searchInput.unit && searchInput.unit) {
			let key = `course.courseUnit[${searchInput.unitQuery}]`;
			queryParams[key] = searchInput.unit;
		}

		const specialFilterKey = QueryParamOperator.SPECIAL_FILTER_KEY;
		let meetingDaysValue = "";
		let meetingDayOp;
		let meetingDaySeparator;
		switch (searchInput.meetingDayQuery) {
			case meetingDayQuery.includeOnly:
				meetingDayOp = QueryParamOperator.LIKE_IGNORE_CASE;
				meetingDaySeparator = QueryParamOperator.AND_SEPARATOR;
				break;
			case meetingDayQuery.includeAny:
				meetingDayOp = QueryParamOperator.LIKE_IGNORE_CASE;
				meetingDaySeparator = QueryParamOperator.OR_SEPARATOR;
				break;
			case meetingDayQuery.excludeOnly:
				meetingDayOp = QueryParamOperator.NOT_LIKE_IGNORE_CASE;
				meetingDaySeparator = QueryParamOperator.OR_SEPARATOR;
				break;
			case meetingDayQuery.excludeAny:
				meetingDayOp = QueryParamOperator.NOT_LIKE_IGNORE_CASE;
				meetingDaySeparator = QueryParamOperator.AND_SEPARATOR;
				break;
		}
		if (searchInput.meetingDays.monday) {
			meetingDaysValue = `meetingDays[${meetingDayOp}]=Mo`;
		}
		if (searchInput.meetingDays.tuesday) {
			const prefix = meetingDaysValue.length > 0 ? meetingDaySeparator : "";
			meetingDaysValue += `${prefix}meetingDays[${meetingDayOp}]=Tu`;
		}
		if (searchInput.meetingDays.wednesday) {
			const prefix = meetingDaysValue.length > 0 ? meetingDaySeparator : "";
			meetingDaysValue += `${prefix}meetingDays[${meetingDayOp}]=We`;
		}
		if (searchInput.meetingDays.thursday) {
			const prefix = meetingDaysValue.length > 0 ? meetingDaySeparator : "";
			meetingDaysValue += `${prefix}meetingDays[${meetingDayOp}]=Th`;
		}
		if (searchInput.meetingDays.friday) {
			const prefix = meetingDaysValue.length > 0 ? meetingDaySeparator : "";
			meetingDaysValue += `${prefix}meetingDays[${meetingDayOp}]=Fr`;
		}
		if (searchInput.meetingDays.saturday) {
			const prefix = meetingDaysValue.length > 0 ? meetingDaySeparator : "";
			meetingDaysValue += `${prefix}meetingDays[${meetingDayOp}]=Sa`;
		}
		if (searchInput.meetingDays.sunday) {
			const prefix = meetingDaysValue.length > 0 ? meetingDaySeparator : "";
			meetingDaysValue += `${prefix}meetingDays[${meetingDayOp}]=Su`;
		}

		if (meetingDaysValue !== "") {
			queryParams[specialFilterKey] = meetingDaysValue;
		}

		return new HttpParams({ fromObject: queryParams });
	}
}
