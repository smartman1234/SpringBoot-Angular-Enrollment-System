import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NavigationBarComponent } from "../../../../core/components/navigation-bar/navigation-bar.component";
import { select, Store } from "@ngrx/store";
import { selectTermInput } from "../../store/search-input/search-input.selectors";
import { takeUntil, withLatestFrom } from "rxjs/operators";
import { selectUserId } from "../../../../core/store/authentication/authentication.selectors";
import { getEnrollmentIds } from "../../store/enrollment/enrollment.actions";
import { selectEnrollmentIdNumber } from "../../store/enrollment/enrollment.selectors";
import { EnrollmentStatus } from "../../constant/enrollment-status";
import { AppState } from "../../../../shared/store/app-store.module";
import { Observable, Subject } from "rxjs";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {

	private readonly unsubscribe$: Subject<void> = new Subject();
	@ViewChild(NavigationBarComponent) navBar!: NavigationBarComponent;
	title = "Course Enrollment";

	cartNumber$!: Observable<number>;
	scheduleNumber$!: Observable<number>;

	constructor(
		private store: Store<AppState>,
	) {
	}

	ngOnInit(): void {
		this.store.pipe(
			select(selectTermInput),
			withLatestFrom(
				this.store.pipe(select(selectUserId)),
			),
			takeUntil(this.unsubscribe$),
		).subscribe(([termName, userId]) => {
			if (termName && userId) {
				this.store.dispatch(getEnrollmentIds({ termName, studentId: userId }));
			}
		});

		this.cartNumber$ = this.store.pipe(
			select(selectEnrollmentIdNumber([EnrollmentStatus.IN_CART])),
		);
		this.scheduleNumber$ = this.store.pipe(
			select(selectEnrollmentIdNumber([EnrollmentStatus.ENROLLED, EnrollmentStatus.ON_WAIT_LIST])),
		);
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
