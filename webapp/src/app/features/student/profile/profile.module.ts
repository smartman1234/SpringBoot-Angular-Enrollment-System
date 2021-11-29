import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProfileComponent } from "./profile/profile.component";
import { SharedModule } from "../../../shared/module/shared.module";


@NgModule({
	declarations: [
		ProfileComponent,
	],
	imports: [
		SharedModule,
		CommonModule,
	],
})
export class ProfileModule {
}
