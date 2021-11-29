import { NgModule } from "@angular/core";
import { AdminCourseListComponent } from "./admin-course-list/admin-course-list.component";
import { AdminCourseEditComponent } from "./admin-course-edit/admin-course-edit.component";
import { SharedModule } from "../../../shared/module/shared.module";
import { CoreModule } from "../../../core/core.module";
import { AdminCourseCreateComponent } from "./admin-course-create/admin-course-create.component";

@NgModule({
	declarations: [
		AdminCourseListComponent,
		AdminCourseEditComponent,
		AdminCourseCreateComponent,
	],
	imports: [
		SharedModule,
		CoreModule,
	],
})
export class AdminCourseModule {
}
