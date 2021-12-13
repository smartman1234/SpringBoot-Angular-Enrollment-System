import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SectionStore } from "./section.store";
import { Observable, throwError } from "rxjs";
import { Page } from "../../../../../core/models/page.model";
import { Slice } from "../../../../../core/models/slice.model";
import { QueryParamOperator } from "../../../../../core/constants/query-param-operator.enum";
import { meetingDayQuery } from "../../../constant/search-field-query";
import { AbstractGenericCrudService } from "../../../../../core/services/generic-crud.service";
import { SearchInputState } from "../search-input/search-input.store";
import { ErrorNotificationService } from "../../../../../core/services/error-notification.service";
import { tap } from "rxjs/operators";
import { Section } from "./section.model";
import { CourseSection } from "./course-section.model";

interface QueryParams {
	[key: string]: string
}

@Injectable({ providedIn: "root" })
export class SectionService extends AbstractGenericCrudService<Section, string> {

	constructor(
		protected http: HttpClient,
		private sectionStore: SectionStore,
		private errorNotificationService: ErrorNotificationService,
	) {
		super(http, "/sections", {
			create: false,
			update: false,
			updatePartial: false,
			delete: false,
		});
	}

	protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
		this.errorNotificationService.open(errorResponse);
		return throwError(errorResponse);
	}

	toCourseSections(sections: Array<Section>): Array<CourseSection> {
		const courses: Array<CourseSection> = [];
		let index = -1;
		let lastCourseCode: string = "";
		sections.map(section => {
			if (section.courseCode !== lastCourseCode) {
				lastCourseCode = section.courseCode;
				let course: CourseSection = {
					courseCode: section.courseCode,
					courseName: section.courseName,
					courseId: section.courseId,
					sections: [],
				};
				courses.push(course);
				courses[++index].sections.push(section);
			} else {
				courses[index].sections.push(section);
			}
		});

		return courses;
	};

	getAll(searchInput: SearchInputState) {
		this.readAll(this.buildQueryParams(searchInput)).pipe(
			tap(sections => {
				this.sectionStore.update({ content: this.toCourseSections(sections) });
			}),
		).subscribe();
	}

	getPage(searchInput: SearchInputState) {
		let httpParams = this.buildQueryParams(searchInput);
		httpParams = this.buildPaginationParams(searchInput, httpParams);

		this.readPage(httpParams).pipe(
			tap(sectionPage => {
				this.sectionStore.update({
					...sectionPage,
					content: this.toCourseSections(sectionPage.content),
				});
			}),
		).subscribe();
	}

	getSlice(searchInput: SearchInputState) {
		let httpParams = this.buildQueryParams(searchInput);
		httpParams = this.buildPaginationParams(searchInput, httpParams);

		this.readSlice(httpParams).pipe(
			tap(sectionSlice => {
				this.sectionStore.update(state => ({
					...sectionSlice,
					totalPages: 0,
					totalElements: 0,
					content: sectionSlice.first
						? this.toCourseSections(sectionSlice.content)
						: state.content.concat(this.toCourseSections(sectionSlice.content)),
				}));
			}),
		).subscribe();
	}

	protected buildPaginationParams(searchInput: SearchInputState, httpParams: HttpParams): HttpParams {
		httpParams = httpParams.append("size", searchInput.size);
		httpParams = httpParams.append("page", searchInput.page);
		if (searchInput.sort) {
			httpParams = httpParams.append("sort", searchInput.sort);
		}

		return httpParams;
	}

	protected buildQueryParams(searchInput: SearchInputState): HttpParams {
		let queryParams: QueryParams = {};

		if (searchInput.term) {
			const key = `term.termName`;
			queryParams[key] = searchInput.term;
		}

		if (searchInput.subject) {
			const key = `course.subject.subjectAcronym`;
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
			const key = `sectionStatus`;
			queryParams[key] = "Open";
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
