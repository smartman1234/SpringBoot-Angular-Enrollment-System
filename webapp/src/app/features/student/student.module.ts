import { NgModule } from "@angular/core";

import { StudentRoutingModule } from "./student-routing.module";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { SharedModule } from "../../shared/module/shared.module";
import { CoreModule } from "../../core/core.module";
import { SearchComponent } from "./components/search/search.component";
import { SearchResultListComponent } from "./components/search-result-list/search-result-list.component";
import { ScheduleComponent } from "./components/schedule/schedule.component";
import { ShoppingCartComponent } from "./components/shopping-cart/shopping-cart.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { StudentStoreModule } from "./store/student-store.module";
import { CourseInfoDialogComponent } from "./components/course-info-dialog/course-info-dialog.component";
import { EnrollmentListComponent } from "./components/enrollment-list/enrollment-list.component";
import { ErrorMessageDialogComponent } from "./components/error-message-dialog/error-message-dialog.component";
import { EnrollWaitListDialogComponent } from "./components/enroll-wait-list-dialog/enroll-wait-list-dialog.component";
import { ResultCardComponent } from "./components/result-card/result-card.component";
import { SearchResultPageComponent } from "./components/search-result-page/search-result-page.component";
import { SearchResultSliceComponent } from "./components/search-result-slice/search-result-slice.component";
import { ResultAccordionComponent } from "./components/result-accordion/result-accordion.component";

@NgModule({
	imports: [
		SharedModule,
		CoreModule,
		StudentStoreModule,
		StudentRoutingModule,
	],
	declarations: [
		DashboardComponent,
		SearchComponent,
		SearchResultListComponent,
		ScheduleComponent,
		ShoppingCartComponent,
		ProfileComponent,
		CourseInfoDialogComponent,
		EnrollmentListComponent,
		ErrorMessageDialogComponent,
		EnrollWaitListDialogComponent,
		ResultCardComponent,
		SearchResultPageComponent,
		SearchResultSliceComponent,
		ResultAccordionComponent,
	],
})
export class StudentModule {
}
