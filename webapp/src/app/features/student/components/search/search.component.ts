import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { selectTermNames } from "../../store/term/term.selectors";
import { combineLatest, Observable, Subject } from "rxjs";
import { filter, takeUntil, withLatestFrom } from "rxjs/operators";
import {
	courseNumberQuery,
	instructorLastNameQuery,
	meetingDayQuery,
	meetingTimeQuery,
	unitQuery,
} from "../../constant/search-field-query";
import { saveSearchInput } from "../../store/search-input/search-input.actions";
import { selectSearchInput } from "../../store/search-input/search-input.selectors";
import { initialSearchInputState } from "../../store/search-input/search-input.reducer";
import { CourseSection } from "../../models/course.sections.model";
import { selectUserId } from "../../../../core/store/authentication/authentication.selectors";
import { AppState } from "../../../../shared/store/app-store.module";
import { CourseService } from "../../services/course.service";
import { addSectionToCart, getEnrollmentIds } from "../../store/enrollment/enrollment.actions";
import { getSectionPage, getSections, getSectionSlice } from "../../store/section/section.actions";
import { selectPageSection } from "../../store/section/section.selectors";
import { selectEnrollmentIds } from "../../store/enrollment/enrollment.selectors";
import { QueryParamOperator } from "../../../../core/constants/query-param-operator.enum";
import { SearchMode } from "../../constant/search-mode";
import { Page } from "../../../../core/models/page.model";
import { PageEvent } from "@angular/material/paginator";
import { ScrollToTopService } from "../../../../core/services/scroll-to-top.service";
import { Subject as SubjectModel } from "../../models/subject.model";
import { selectSubjects } from "../../store/subject/subject.selectors";
import { getAllTerms } from "../../store/term/term.actions";
import { getAllSubjects } from "../../store/subject/subject.actions";

@Component({
	selector: "app-search",
	templateUrl: "./search.component.html",
	styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit, OnDestroy {

	private readonly unsubscribe$: Subject<void> = new Subject();

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

	pageSection$!: Observable<Page<CourseSection>>;
	registeredSectionIds$!: Observable<Array<string>>;

	constructor(
		private formBuilder: FormBuilder,
		private courseService: CourseService,
		private store: Store<AppState>,
		private scrollToTopService: ScrollToTopService,
	) {
	}

	onSubmit() {
		this.toggleResult();
		switch (this.searchMode.value) {
			case SearchMode.PAGE:
				this.page.setValue(0);
				this.store.dispatch(getSectionPage({
					searchInput: this.searchForm.value,
				}));
				break;
			case SearchMode.SLICE:
				this.page.setValue(0);
				this.size.setValue(20);
				this.store.dispatch(getSectionSlice({
					searchInput: this.searchForm.value,
				}));
				break;
			default:
				this.store.dispatch(getSections({
					searchInput: this.searchForm.value,
				}));
		}

		// this.getRegisteredSectionIds();
	}

	onPageEvent(pageEvent: PageEvent) {
		this.size.setValue(pageEvent.pageSize);
		this.page.setValue(pageEvent.pageIndex);

		this.store.dispatch(getSectionPage({
			searchInput: this.searchForm.value,
		}));

		this.scrollToTopService.toTop("content", 50);
	}

	onScrollBottom(pageIndex: number) {
		this.page.setValue(pageIndex);
		this.size.setValue(20);
		this.store.dispatch(getSectionSlice({
			searchInput: this.searchForm.value,
		}));
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
		this.searchForm.reset(initialSearchInputState);
		this.store.dispatch(saveSearchInput({ searchInput: initialSearchInputState }));
	}

	addToCart(sectionId: string) {
		this.store.dispatch(addSectionToCart({
			studentId: this.studentId,
			sectionId,
		}));
	}

	getRegisteredSectionIds() {
		this.store.dispatch(getEnrollmentIds({
			termName: this.term.value,
			studentId: this.studentId,
		}));
	}

	openCourseInfo(courseId: string) {
		this.courseService.openCourseInfo(courseId);
	}

	ngOnInit(): void {
		//  retrieve valid term names on first render,
		// retrieve valid subject names on first render,
		//  get current userid, restore saved form input, retrieve enrollments
		this.store.dispatch(getAllTerms());
		this.store.dispatch(getAllSubjects());
		combineLatest([
			this.store.pipe(select(selectTermNames)),
			this.store.pipe(select(selectSubjects)),
		]).pipe(
			filter(([termNames, subjects]) => termNames.length > 0 && subjects.length > 0),
			withLatestFrom(
				this.store.pipe(select(selectSearchInput)),
				this.store.pipe(select(selectUserId)),
			),
		).subscribe(([[termNames, subjects], searchInput, userId]) => {
			this.termNames = termNames;
			this.subjects = subjects;
			this.studentId = userId;
			if (searchInput.term) {
				this.searchForm.setValue(searchInput);
			} else {
				this.term.setValue(termNames[0]);
				this.subject.setValue(subjects[0].subjectAcronym);
			}
		});

		// auto save form input on changes
		this.searchForm.valueChanges.pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(
			() => this.store.dispatch(saveSearchInput({ searchInput: this.searchForm.value })),
		);

		this.pageSection$ = this.store.pipe(select(selectPageSection));
		this.registeredSectionIds$ = this.store.pipe(select(selectEnrollmentIds()));
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
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

