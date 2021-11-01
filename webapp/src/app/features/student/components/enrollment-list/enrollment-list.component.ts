import { Component, ContentChild, Input, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { Enrollment } from "../../models/enrollment.model";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { getAllTerms } from "../../store/term/term.actions";
import { select, Store } from "@ngrx/store";
import { selectTermNames } from "../../store/term/term.selectors";
import { filter, takeUntil, withLatestFrom } from "rxjs/operators";
import { selectTermInput } from "../../store/search-input/search-input.selectors";
import { selectUserId } from "../../../../core/store/authentication/authentication.selectors";
import { AppState } from "../../../../shared/store/app-store.module";
import { EnrollmentService } from "../../services/enrollment.service";
import { EnrollmentStatus } from "../../constant/enrollment-status";
import { Observable, Subject } from "rxjs";
import { selectEnrollments } from "../../store/enrollment/enrollment.selectors";
import {
	dropEnrollment,
	enroll,
	enrollFromWaitList,
	getEnrollments,
	removeEnrollment,
} from "../../store/enrollment/enrollment.actions";
import { saveTermInput } from "../../store/search-input/search-input.actions";

@Component({
	selector: "app-enrollment-list",
	templateUrl: "./enrollment-list.component.html",
	styleUrls: ["./enrollment-list.component.scss"],
})
export class EnrollmentListComponent implements OnInit, OnDestroy {

	private readonly unsubscribe$: Subject<void> = new Subject();
	displayedColumns: string[] = ["section", "schedule", "room", "instructor", "dates",
		"capacity", "enrolled", "waitList", "status", "action"];

	constructor(
		private enrollmentService: EnrollmentService,
		private formBuilder: FormBuilder,
		private store: Store<AppState>,
	) {
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
		this.store.dispatch(getAllTerms());
		this.store.pipe(
			select(selectTermNames),
			filter(termNames => termNames.length > 0),
			withLatestFrom(
				this.store.pipe(select(selectTermInput)),
				this.store.pipe(select(selectUserId)),
			),
			takeUntil(this.unsubscribe$),
		).subscribe(([termNames, term, userId]) => {
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
			() => this.store.dispatch(saveTermInput({ termName: this.term.value })),
		);

		this.enrollments$ = this.store.pipe(select(selectEnrollments));
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	getEnrollments() {
		this.store.dispatch(getEnrollments({
			enrollmentStatuses: this.enrollmentStatuses,
			termName: this.term.value,
			studentId: this.studentId,
		}));
	}

	enroll(enrollments: Array<Enrollment>) {
		this.store.dispatch(enroll({
			termName: this.term.value,
			studentId: this.studentId,
			enrollments: enrollments,
		}));
	}

	enrollFromWaitList(sectionId: string) {
		this.store.dispatch(enrollFromWaitList({
			termName: this.term.value,
			studentId: this.studentId,
			sectionId: sectionId,
		}));
	}

	dropEnrollment(enrollment: Enrollment) {
		this.store.dispatch(dropEnrollment({ enrollment }));
	}

	removeEnrollment(enrollment: Enrollment) {
		this.store.dispatch(removeEnrollment({ enrollment }));
	}

	openErrorMessages() {
		this.enrollmentService.openErrorMessages();
	}

	asEnrollment(value: any): Enrollment {
		return value as Enrollment;
	}
}

