import { ChangeDetectionStrategy, Component, ContentChild, Input, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { EnrollmentStatus } from "../../../../core/constants/enrollment-status";
import { filter, takeUntil } from "rxjs/operators";
import { UnsubscribeComponent } from "../../../../core/components/unsubscribe/unsubscribe.component";
import { EnrollmentService } from "../state/enrollment/enrollment.service";
import { Enrollment } from "../state/enrollment/enrollment.model";
import { AuthenticationQuery } from "../../../../core/state/authentication/authentication.query";
import { TermService } from "../../search/state/term/term.service";
import { TermQuery } from "../../search/state/term/term.query";
import { SearchInputStore } from "../../search/state/search-input/search-input.store";
import { SearchInputQuery } from "../../search/state/search-input/search-input.query";
import { EnrollmentQuery } from "../state/enrollment/enrollment.query";
import { combineQueries } from "@datorama/akita";

@Component({
	selector: "app-enrollment-list",
	templateUrl: "./enrollment-list.component.html",
	styleUrls: ["./enrollment-list.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollmentListComponent extends UnsubscribeComponent implements OnInit, OnDestroy {

	private tempUnsubscribe$ = new Subject<void>();

	ngOnDestroy(): void {
		super.ngOnDestroy();
		this.tempUnsubscribe$.next();
		this.tempUnsubscribe$.complete();
	}

	displayedColumns: string[] = ["section", "schedule", "room", "instructor", "dates",
		"capacity", "enrolled", "waitList", "status", "action"];

	constructor(
		private authenticationQuery: AuthenticationQuery,
		private enrollmentService: EnrollmentService,
		private enrollmentQuery: EnrollmentQuery,
		private termService: TermService,
		private termQuery: TermQuery,
		private searchInputStore: SearchInputStore,
		private searchInputQuery: SearchInputQuery,
		private formBuilder: FormBuilder,
	) {
		super();
	}

	@Input() title!: string;
	@Input() subtitle!: string;
	@Input() enrollmentStatuses: EnrollmentStatus[] = [];
	@ContentChild("legend") legendRef!: TemplateRef<any>;
	@ContentChild("sectionStatus") sectionStatusRef!: TemplateRef<any>;
	@ContentChild("actionButton") actionButtonRef!: TemplateRef<any>;
	@ContentChild("smallSectionStatus") smallSectionStatusRef!: TemplateRef<any>;
	@ContentChild("smallActionButton") smallActionButtonRef!: TemplateRef<any>;
	@ContentChild("enrollButton") enrollButtonRef!: TemplateRef<any>;

	enrollments$!: Observable<Array<Enrollment>>;
	termNames: string[] = [];
	studentId: string = "";

	selectTermForm = this.formBuilder.group({
		term: ["", { validators: [Validators.required] }],
	});

	get term() {
		return this.selectTermForm.get("term") as FormControl;
	}

	ngOnInit(): void {
		//  retrieve valid term names on first render, get current userid,
		//  restore saved form input, retrieve enrollments
		this.termService.getAll();
		combineQueries([
			this.termQuery.termNames$.pipe(filter(termNames => termNames.length > 0)),
			this.searchInputQuery.termInput$,
			this.authenticationQuery.id$,
		]).pipe(
			takeUntil(this.tempUnsubscribe$),
		).subscribe(([termNames, term, userId]) => {
			this.tempUnsubscribe$.next();
			this.tempUnsubscribe$.complete();

			this.termNames = termNames;
			this.studentId = userId;
			if (term) {
				this.term.setValue(term);
			} else {
				this.term.setValue(termNames[0]);
			}
			this.getEnrollments();
		});

		// auto save form input on changes
		this.term.valueChanges.pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(
			() => this.searchInputStore.update({ term: this.term.value }),
		);

		this.enrollments$ = this.enrollmentQuery.enrollments$;
	}

	getEnrollments() {
		this.enrollmentService.getAll(this.enrollmentStatuses, this.term.value, this.studentId);
	}

	enroll(enrollments: Array<Enrollment>) {
		this.enrollmentService.enroll(this.studentId, enrollments);
	}

	enrollFromWaitList(sectionId: string) {
		this.enrollmentService.enrollFromWaitList(this.studentId, sectionId);
	}

	dropEnrollment(enrollment: Enrollment) {
		this.enrollmentService.dropEnrollment(enrollment);
	}

	removeEnrollment(enrollment: Enrollment) {
		this.enrollmentService.removeEnrollment(enrollment);
	}

	openErrorMessages() {
		this.enrollmentService.openErrorMessages();
	}

	asEnrollment(value: any): Enrollment {
		return value as Enrollment;
	}

	trackEnrollment(index: number, enrollment: Enrollment): string {
		return enrollment.sectionId;
	}

}
