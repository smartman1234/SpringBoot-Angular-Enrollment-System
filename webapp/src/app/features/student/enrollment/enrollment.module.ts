import { NgModule } from "@angular/core";
import { EnrollWaitListDialogComponent } from "./enroll-wait-list-dialog/enroll-wait-list-dialog.component";
import { EnrollmentListComponent } from "./enrollment-list/enrollment-list.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { ShoppingCartComponent } from "./shopping-cart/shopping-cart.component";
import { SharedModule } from "../../../shared/module/shared.module";
import { CoreModule } from "../../../core/core.module";

@NgModule({
	declarations: [
		EnrollWaitListDialogComponent,
		EnrollmentListComponent,
		ScheduleComponent,
		ShoppingCartComponent,
	],
	imports: [
		SharedModule,
		CoreModule,
	],
})
export class EnrollmentModule {
}
