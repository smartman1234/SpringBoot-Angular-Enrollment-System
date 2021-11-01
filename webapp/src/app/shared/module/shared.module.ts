import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./material.module";
import { InfiniteScrollModule } from "ngx-infinite-scroll";

@NgModule({
	declarations: [],
	imports: [],
	exports: [
		CommonModule,
		ReactiveFormsModule,
		MaterialModule,
		InfiniteScrollModule,
	],
})
export class SharedModule {
}
