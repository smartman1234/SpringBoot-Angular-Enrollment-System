import { NgModule } from "@angular/core";
import { AdminAuthorityListComponent } from "./admin-authority-list/admin-authority-list.component";
import { AdminAuthorityCreateComponent } from "./admin-authority-create/admin-authority-create.component";
import { AdminAuthorityEditComponent } from "./admin-authority-edit/admin-authority-edit.component";
import { SharedModule } from "../../../shared/module/shared.module";
import { CoreModule } from "../../../core/core.module";


@NgModule({
	declarations: [
		AdminAuthorityListComponent,
		AdminAuthorityCreateComponent,
		AdminAuthorityEditComponent,
	],
	imports: [
		SharedModule,
		CoreModule,
	],
})
export class AdminAuthorityModule {
}
