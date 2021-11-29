import { NgModule } from "@angular/core";
import { AdminDepartmentEditComponent } from "./admin-department-edit/admin-department-edit.component";
import { SharedModule } from "../../../shared/module/shared.module";
import { CoreModule } from "../../../core/core.module";
import { AdminDepartmentListComponent } from './admin-department-list/admin-department-list.component';
import { AdminDepartmentCreateComponent } from './admin-department-create/admin-department-create.component';


@NgModule({
	declarations: [
		AdminDepartmentEditComponent,
  AdminDepartmentListComponent,
  AdminDepartmentCreateComponent,
	],
	imports: [
		SharedModule,
		CoreModule,
	],
})
export class AdminDepartmentModule {
}
