import { NgModule } from "@angular/core";
import { AdminInstructorCreateComponent } from "./admin-instructor-create/admin-instructor-create.component";
import { AdminInstructorEditComponent } from "./admin-instructor-edit/admin-instructor-edit.component";
import { AdminInstructorListComponent } from "./admin-instructor-list/admin-instructor-list.component";
import { SharedModule } from "../../../shared/module/shared.module";
import { CoreModule } from "../../../core/core.module";

@NgModule({
	declarations: [
		AdminInstructorCreateComponent,
		AdminInstructorEditComponent,
		AdminInstructorListComponent,
	],
	imports: [
		SharedModule,
		CoreModule,
	],
})
export class AdminInstructorModule {
}
