import { Action, createReducer, on } from "@ngrx/store";
import { getSectionPageSuccess, getSectionSliceSuccess, getSectionsSuccess } from "./section.actions";
import { CourseSection } from "../../models/course.sections.model";
import { Page } from "../../../../core/models/page.model";
import { Section } from "../../models/section.model";

export interface PageSectionState extends Page<CourseSection> {
}

export const initialPageSectionState: PageSectionState = {
	content: [],
	pageable: {
		sort: {
			unsorted: false,
			sorted: true,
			empty: false,
		},
		pageNumber: 0,
		pageSize: 20,
		offset: 0,
		paged: true,
		unpaged: false,
	},
	sort: {
		unsorted: false,
		sorted: true,
		empty: false,
	},
	totalPages: 0,
	totalElements: 0,
	first: true,
	last: true,
	size: 20,
	number: 0,
	numberOfElements: 0,
	empty: true,
};

const reducer = createReducer(
	initialPageSectionState,
	on(getSectionsSuccess, (state, { sections }) => ({
		...initialPageSectionState,
		content: toCourseSections(sections),
	})),
	on(getSectionPageSuccess, (state, { pageSection }) => ({
		...pageSection,
		content: toCourseSections(pageSection.content),
	})),
	on(getSectionSliceSuccess, (state, { sliceSection }) => ({
		...sliceSection,
		totalPages: 0,
		totalElements: 0,
		content: sliceSection.first
			? toCourseSections(sliceSection.content)
			: state.content.concat(toCourseSections(sliceSection.content)),
	})),
);

const toCourseSections = (sections: Array<Section>): Array<CourseSection> => {
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

export function PageSectionReducer(state: PageSectionState | undefined, action: Action) {
	return reducer(state, action);
}

