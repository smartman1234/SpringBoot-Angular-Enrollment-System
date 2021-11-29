import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NavigationBarComponent } from "../../../../core/components/navigation-bar/navigation-bar.component";
import { select, Store } from "@ngrx/store";
import { selectTermInput } from "../../store/search-input/search-input.selectors";
import { takeUntil, withLatestFrom } from "rxjs/operators";
import { selectUserId } from "../../../../core/store/authentication/authentication.selectors";
import { getEnrollmentIds } from "../../store/enrollment/enrollment.actions";
import { selectEnrollmentIdNumber } from "../../store/enrollment/enrollment.selectors";
import { EnrollmentStatus } from "../../../../core/constants/enrollment-status";
import { AppState } from "../../../../shared/store/app-store.module";
import { Observable, Subject } from "rxjs";
import { getSectionsSuccess } from "../../store/section/section.actions";
import { ScrollToTopService } from "../../../../core/services/scroll-to-top.service";

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

	currentTermName: string = "";

	ngOnInit(): void {
		this.store.pipe(
			select(selectTermInput),
			withLatestFrom(
				this.store.pipe(select(selectUserId)),
			),
			takeUntil(this.unsubscribe$),
		).subscribe(([termName, userId]) => {
			if (termName && userId) {
				if (termName !== this.currentTermName) {
					this.currentTermName = termName;
					this.store.dispatch(getEnrollmentIds({ termName, studentId: userId }));
					this.store.dispatch(getSectionsSuccess({ sections: [] }));
				}
			}
		});

		this.cartNumber$ = this.store.pipe(
			select(selectEnrollmentIdNumber([EnrollmentStatus.IN_CART])),
		);
		this.scheduleNumber$ = this.store.pipe(
			select(selectEnrollmentIdNumber([EnrollmentStatus.ENROLLED, EnrollmentStatus.ON_WAIT_LIST])),
		);
	}

	constructor(
		private scrollToTopService: ScrollToTopService,
		private store: Store<AppState>,
	) {
	}

	onActivate() {
		if (this.navBar != null) {
			this.scrollToTopService.toTop("content");
		}
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
