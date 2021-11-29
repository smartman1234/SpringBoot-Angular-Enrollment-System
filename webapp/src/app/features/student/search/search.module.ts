import { NgModule } from "@angular/core";
import { CourseInfoDialogComponent } from "./course-info-dialog/course-info-dialog.component";
import { SearchComponent } from "./search/search.component";
import { SearchResultListComponent } from "./search-result-list/search-result-list.component";
import { SearchResultPageComponent } from "./search-result-page/search-result-page.component";
import { SearchResultSliceComponent } from "./search-result-slice/search-result-slice.component";
import { SearchResultComponent } from "./search-result/search-result.component";
import { SharedModule } from "../../../shared/module/shared.module";
import { CoreModule } from "../../../core/core.module";

@NgModule({
	declarations: [
		CourseInfoDialogComponent,
		SearchComponent,
		SearchResultListComponent,
		SearchResultPageComponent,
		SearchResultSliceComponent,
		SearchResultComponent,
	],
	imports: [
		SharedModule,
		CoreModule,
	],
})
export class SearchModule {
}
