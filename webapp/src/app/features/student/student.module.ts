import { NgModule } from "@angular/core";

import { StudentRoutingModule } from "./student-routing.module";
import { SharedModule } from "../../shared/module/shared.module";
import { CoreModule } from "../../core/core.module";
import { SearchModule } from "./search/search.module";
import { EnrollmentModule } from "./enrollment/enrollment.module";
import { ProfileModule } from "./profile/profile.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { StudentComponent } from './student.component';

@NgModule({
	imports: [
		SharedModule,
		CoreModule,
		SearchModule,
		EnrollmentModule,
		ProfileModule,
		StudentRoutingModule,
	],
	declarations: [
		DashboardComponent,
  StudentComponent,
	],
})
export class StudentModule {
}
