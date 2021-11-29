import { NgModule } from "@angular/core";
import { AdminRoomListComponent } from "./admin-room-list/admin-room-list.component";
import { AdminRoomCreateComponent } from "./admin-room-create/admin-room-create.component";
import { AdminRoomEditComponent } from "./admin-room-edit/admin-room-edit.component";
import { SharedModule } from "../../../shared/module/shared.module";
import { CoreModule } from "../../../core/core.module";


@NgModule({
	declarations: [
		AdminRoomListComponent,
		AdminRoomCreateComponent,
		AdminRoomEditComponent,
	],
	imports: [
		SharedModule,
		CoreModule,
	],
})
export class AdminRoomModule {
}
