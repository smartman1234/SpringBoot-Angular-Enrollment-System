import { NgModule } from "@angular/core";
import { AdminBuildingListComponent } from "./admin-building-list/admin-building-list.component";
import { AdminBuildingCreateComponent } from "./admin-building-create/admin-building-create.component";
import { AdminBuildingEditComponent } from "./admin-building-edit/admin-building-edit.component";
import { SharedModule } from "../../../shared/module/shared.module";
import { CoreModule } from "../../../core/core.module";


@NgModule({
	declarations: [
		AdminBuildingListComponent,
		AdminBuildingCreateComponent,
		AdminBuildingEditComponent,
	],
	imports: [
		SharedModule,
		CoreModule,
	],
})
export class AdminBuildingModule {
}
