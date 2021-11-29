import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { UnsubscribeComponent } from "../../../core/components/unsubscribe/unsubscribe.component";
import { NavigationBarComponent } from "../../../core/components/navigation-bar/navigation-bar.component";
import { Observable } from "rxjs";
import { ScrollToTopService } from "../../../core/services/scroll-to-top.service";
import { SearchInputQuery } from "../search/state/search-input/search-input.query";
import { TermQuery } from "../search/state/term/term.query";
import { AuthenticationQuery } from "../../../core/state/authentication/authentication.query";
import { filter, takeUntil } from "rxjs/operators";
import { EnrollmentIdService } from "../enrollment/state/enrollment-id/enrollment-id.service";
import { SectionStore } from "../search/state/section/section.store";
import { EnrollmentIdQuery } from "../enrollment/state/enrollment-id/enrollment-id.query";
import { EnrollmentStatus } from "../../../core/constants/enrollment-status";
import { combineQueries } from "@datorama/akita";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent extends UnsubscribeComponent implements OnInit {

	constructor(
		private termQuery: TermQuery,
		private authenticationQuery: AuthenticationQuery,
		private enrollmentIdService: EnrollmentIdService,
		private enrollmentIdQuery: EnrollmentIdQuery,
		private sectionStore: SectionStore,
		private searchInputQuery: SearchInputQuery,
		private scrollToTopService: ScrollToTopService,
	) {
		super();
	}

	@ViewChild(NavigationBarComponent) navBar!: NavigationBarComponent;
	title = "Course Enrollment";

	cartNumber$!: Observable<number>;
	scheduleNumber$!: Observable<number>;

	currentTermName: string = "";

	ngOnInit(): void {
		combineQueries([
			this.searchInputQuery.termInput$.pipe(filter(termName => termName.length > 0)),
			this.authenticationQuery.id$,
		]).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(([termName, userId]) => {
			if (termName && userId) {
				if (termName !== this.currentTermName) {
					this.currentTermName = termName;
					this.enrollmentIdService.getEnrollmentIds(termName, userId);
					this.sectionStore.update({ content: [] });
				}
			}
		});

		this.cartNumber$ = this.enrollmentIdQuery.enrollmentIdNumber([EnrollmentStatus.IN_CART]);
		this.scheduleNumber$ = this.enrollmentIdQuery
			.enrollmentIdNumber([EnrollmentStatus.ENROLLED, EnrollmentStatus.ON_WAIT_LIST]);

	}

	onActivate() {
		if (this.navBar != null) {
			this.scrollToTopService.toTop("content");
		}
	}

}
