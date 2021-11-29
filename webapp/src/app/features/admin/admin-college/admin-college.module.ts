import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminCollegeListComponent } from "./admin-college-list/admin-college-list.component";
import { AdminCollegeCreateComponent } from "./admin-college-create/admin-college-create.component";
import { AdminCollegeEditComponent } from "./admin-college-edit/admin-college-edit.component";
import { SharedModule } from "../../../shared/module/shared.module";
import { CoreModule } from "../../../core/core.module";


@NgModule({
	declarations: [
		AdminCollegeListComponent,
		AdminCollegeCreateComponent,
		AdminCollegeEditComponent,
	],
	imports: [
		SharedModule,
		CoreModule,
	],
})
export class AdminCollegeModule {
}
