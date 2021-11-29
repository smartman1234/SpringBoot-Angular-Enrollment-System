import { NgModule } from "@angular/core";
import { AdminUserListComponent } from "./admin-user-list/admin-user-list.component";
import { AdminUserCreateComponent } from "./admin-user-create/admin-user-create.component";
import { AdminUserEditComponent } from "./admin-user-edit/admin-user-edit.component";
import { SharedModule } from "../../../shared/module/shared.module";
import { CoreModule } from "../../../core/core.module";
import { AdminUserPasswordChangeComponent } from './admin-user-password-change/admin-user-password-change.component';


@NgModule({
	declarations: [
		AdminUserListComponent,
		AdminUserCreateComponent,
		AdminUserEditComponent,
  AdminUserPasswordChangeComponent,
	],
	imports: [
		SharedModule,
		CoreModule,
	],
})
export class AdminUserModule {
}
