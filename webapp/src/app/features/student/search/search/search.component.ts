import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { SearchMode } from "../../constant/search-mode";
import {
	courseNumberQuery,
	instructorLastNameQuery,
	meetingDayQuery,
	meetingTimeQuery,
	unitQuery,
} from "../../constant/search-field-query";
import { Page } from "../../../../core/models/page.model";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ScrollToTopService } from "../../../../core/services/scroll-to-top.service";
import { PageEvent } from "@angular/material/paginator";
import { filter, takeUntil } from "rxjs/operators";
import { QueryParamOperator } from "../../../../core/constants/query-param-operator.enum";
import { CourseService } from "../state/course/course.service";
import { CourseSection } from "../state/section/course-section.model";
import { Subject as SubjectModel } from "../state/subject/subject.model";
import { SectionQuery } from "../state/section/section.query";
import { SectionService } from "../state/section/section.service";
import { TermService } from "../state/term/term.service";
import { TermQuery } from "../state/term/term.query";
import { initialSearchInputState, SearchInputStore } from "../state/search-input/search-input.store";
import { EnrollmentService } from "../../enrollment/state/enrollment/enrollment.service";
import { SubjectService } from "../state/subject/subject.service";
import { SubjectQuery } from "../state/subject/subject.query";
import { UnsubscribeComponent } from "../../../../core/components/unsubscribe/unsubscribe.component";
import { AuthenticationQuery } from "../../../../core/state/authentication/authentication.query";
import { SearchInputQuery } from "../state/search-input/search-input.query";
import { EnrollmentIdQuery } from "../../enrollment/state/enrollment-id/enrollment-id.query";
import { combineQueries } from "@datorama/akita";

@Component({
	selector: "app-search",
	templateUrl: "./search.component.html",
	styleUrls: ["./search.component.scss"],
})
export class SearchComponent extends UnsubscribeComponent implements OnInit, OnDestroy {

	private tempUnsubscribe$ = new Subject<void>();

	ngOnDestroy(): void {
		super.ngOnDestroy();
		this.tempUnsubscribe$.next();
		this.tempUnsubscribe$.complete();
	}

	listVisibility: boolean = false;
	pageVisibility: boolean = false;
	sliceVisibility: boolean = false;

	readonly searchModes = Object.values(SearchMode);

	readonly courseNumberQueries = Object.entries(courseNumberQuery);
	readonly meetingTimeQueries = Object.entries(meetingTimeQuery);
	readonly meetingDayQueries = Object.values(meetingDayQuery);
	readonly instructorLastNameQueries = Object.entries(instructorLastNameQuery);
	readonly unitQueries = Object.entries(unitQuery);

	subjects: Array<SubjectModel> = [];
	termNames: string[] = [];
	studentId: string = "";

	sectionPage$!: Observable<Page<CourseSection>>;
	registeredSectionIds$!: Observable<Array<string>>;

	constructor(
		private formBuilder: FormBuilder,
		private authenticationQuery: AuthenticationQuery,
		private enrollmentService: EnrollmentService,
		private enrollmentIdQuery: EnrollmentIdQuery,
		private sectionService: SectionService,
		private sectionQuery: SectionQuery,
		private courseService: CourseService,
		private subjectService: SubjectService,
		private subjectQuery: SubjectQuery,
		private termService: TermService,
		private termQuery: TermQuery,
		private searchInputStore: SearchInputStore,
		private searchInputQuery: SearchInputQuery,
		private scrollToTopService: ScrollToTopService,
	) {
		super();
	}

	onSubmit() {
		this.toggleResult();
		switch (this.searchMode.value) {
			case SearchMode.PAGE:
				this.page.setValue(0);
				this.sectionService.getPage(this.searchForm.value);
				break;
			case SearchMode.SLICE:
				this.page.setValue(0);
				this.size.setValue(20);
				this.sectionService.getSlice(this.searchForm.value);
				break;
			default:
				this.sectionService.getAll(this.searchForm.value);
		}

	}

	onPageEvent(pageEvent: PageEvent) {
		this.size.setValue(pageEvent.pageSize);
		this.page.setValue(pageEvent.pageIndex);
		this.sectionService.getPage(this.searchForm.value);
		this.scrollToTopService.toTop("content", 50);
	}

	onScrollBottom(pageIndex: number) {
		this.page.setValue(pageIndex);
		this.size.setValue(20);
		this.sectionService.getSlice(this.searchForm.value);
	}

	toggleResult() {
		switch (this.searchMode.value) {
			case SearchMode.LIST:
				this.listVisibility = !this.listVisibility;
				break;
			case SearchMode.PAGE:
				this.pageVisibility = !this.pageVisibility;
				break;
			case SearchMode.SLICE:
				this.sliceVisibility = !this.sliceVisibility;
				break;
			default:
				this.listVisibility = !this.listVisibility;
		}
		this.scrollToTopService.toTop("content");
	}

	clearForm() {
		this.searchForm.reset(initialSearchInputState());
		this.searchInputStore.update(this.searchForm.value);
	}

	addToCart(sectionId: string) {
		this.enrollmentService.addSectionToCart(this.studentId, sectionId);
	}

	openCourseInfo(courseId: string) {
		this.courseService.openCourseInfo(courseId);
	}

	ngOnInit(): void {
		//  retrieve valid term names on first render,
		// retrieve valid subject names on first render,
		//  get current userid, restore saved form input, retrieve enrollments
		this.termService.getAll();
		this.subjectService.getAll();
		combineQueries([
			this.termQuery.termNames$.pipe(filter(termNames => termNames.length > 0)),
			this.subjectQuery.subjects$.pipe(filter(subjects => subjects.length > 0)),
			this.searchInputQuery.searchInput$,
			this.authenticationQuery.id$,
		]).pipe(
			takeUntil(this.tempUnsubscribe$),
		).subscribe(([termNames, subjects, searchInput, userId]) => {
			this.tempUnsubscribe$.next();
			this.tempUnsubscribe$.complete();

			this.termNames = termNames;
			this.subjects = subjects;
			this.studentId = userId;
			if (searchInput.term) {
				this.searchForm.setValue(searchInput);
				if (!searchInput.subject) {
					this.subject.setValue(subjects[0].subjectAcronym);
				}
			} else {
				this.term.setValue(termNames[0]);
				this.subject.setValue(subjects[0].subjectAcronym);
			}


		});

		// auto save form input on changes
		this.searchForm.valueChanges.pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(() => {
			this.searchInputStore.update(this.searchForm.value);
		});

		this.sectionPage$ = this.sectionQuery.sectionPage$;
		this.registeredSectionIds$ = this.enrollmentIdQuery.enrollmentIds();
	}

	searchForm = this.formBuilder.group({
		term: ["", { validators: [Validators.required] }],
		subject: ["", { validators: [Validators.required] }],
		courseName: "",
		courseNumber: "",
		courseNumberQuery: [QueryParamOperator.EQUALS],
		sectionStatusOpen: [true],
		meetingTimeStart: "",
		meetingTimeStart2: "",
		meetingTimeStartQuery: [QueryParamOperator.GREATER_THAN_OR_EQUAL],
		meetingTimeEnd: "",
		meetingTimeEnd2: "",
		meetingTimeEndQuery: [QueryParamOperator.GREATER_THAN_OR_EQUAL],
		meetingDays: this.formBuilder.group({
			monday: false,
			tuesday: false,
			wednesday: false,
			thursday: false,
			friday: false,
			saturday: false,
			sunday: false,
		}),
		meetingDayQuery: this.meetingDayQueries[3],
		instructorLastName: "",
		instructorLastNameQuery: QueryParamOperator.STARTS_WITH_IGNORE_CASE,
		unit: "",
		unitQuery: QueryParamOperator.GREATER_THAN_OR_EQUAL,
		searchMode: SearchMode.LIST,
		page: 0,
		size: 20,
		sort: "",
	});

	get term() {
		return this.searchForm.get("term") as FormControl;
	}

	get subject() {
		return this.searchForm.get("subject") as FormControl;
	}

	get courseName() {
		return this.searchForm.get("courseName") as FormControl;
	}

	get courseNumber() {
		return this.searchForm.get("courseNumber") as FormControl;
	}

	get meetingTimeStart() {
		return this.searchForm.get("meetingTimeStart") as FormControl;
	}

	get meetingTimeStart2() {
		return this.searchForm.get("meetingTimeStart2") as FormControl;
	}

	get meetingTimeEnd() {
		return this.searchForm.get("meetingTimeEnd") as FormControl;
	}

	get meetingTimeEnd2() {
		return this.searchForm.get("meetingTimeEnd2") as FormControl;
	}

	get instructorLastName() {
		return this.searchForm.get("instructorLastName") as FormControl;
	}

	get unit() {
		return this.searchForm.get("unit") as FormControl;
	}

	get searchMode() {
		return this.searchForm.get("searchMode") as FormControl;
	}

	get page() {
		return this.searchForm.get("page") as FormControl;
	}

	get size() {
		return this.searchForm.get("size") as FormControl;
	}

	get sort() {
		return this.searchForm.get("sort") as FormControl;
	}

}
