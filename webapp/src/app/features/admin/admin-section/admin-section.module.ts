import { NgModule } from "@angular/core";
import { AdminSectionListComponent } from "./admin-section-list/admin-section-list.component";
import { AdminSectionEditComponent } from "./admin-section-edit/admin-section-edit.component";
import { AdminSectionCreateComponent } from "./admin-section-create/admin-section-create.component";
import { SharedModule } from "../../../shared/module/shared.module";
import { CoreModule } from "../../../core/core.module";


@NgModule({
	declarations: [
		AdminSectionListComponent,
		AdminSectionEditComponent,
		AdminSectionCreateComponent,
	],
	imports: [
		SharedModule,
		CoreModule,
	],
})
export class AdminSectionModule {
}
