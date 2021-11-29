import { NgModule } from "@angular/core";
import { AdminStudentListComponent } from "./admin-student-list/admin-student-list.component";
import { AdminStudentCreateComponent } from "./admin-student-create/admin-student-create.component";
import { AdminStudentEditComponent } from "./admin-student-edit/admin-student-edit.component";
import { SharedModule } from "../../../shared/module/shared.module";
import { CoreModule } from "../../../core/core.module";


@NgModule({
	declarations: [
		AdminStudentListComponent,
		AdminStudentCreateComponent,
		AdminStudentEditComponent,
	],
	imports: [
		SharedModule,
		CoreModule,
	],
})
export class AdminStudentModule {
}
