import { NgModule } from "@angular/core";
import { SharedModule } from "../../../shared/module/shared.module";
import { CoreModule } from "../../../core/core.module";
import { AdminTermListComponent } from './admin-term-list/admin-term-list.component';
import { AdminTermCreateComponent } from './admin-term-create/admin-term-create.component';
import { AdminTermEditComponent } from './admin-term-edit/admin-term-edit.component';


@NgModule({
	declarations: [
    AdminTermListComponent,
    AdminTermCreateComponent,
    AdminTermEditComponent
  ],
	imports: [
		SharedModule,
		CoreModule,
	],
})
export class AdminTermModule {
}
