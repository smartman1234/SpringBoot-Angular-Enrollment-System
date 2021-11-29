import { NgModule } from "@angular/core";
import { AdminSubjectListComponent } from "./admin-subject-list/admin-subject-list.component";
import { AdminSubjectCreateComponent } from "./admin-subject-create/admin-subject-create.component";
import { AdminSubjectEditComponent } from "./admin-subject-edit/admin-subject-edit.component";
import { SharedModule } from "../../../shared/module/shared.module";
import { CoreModule } from "../../../core/core.module";


@NgModule({
	declarations: [
		AdminSubjectListComponent,
		AdminSubjectCreateComponent,
		AdminSubjectEditComponent,
	],
	imports: [
		SharedModule,
		CoreModule,
	],
})
export class AdminSubjectModule {
}
