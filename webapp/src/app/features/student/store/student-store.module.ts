import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { TermEffects } from "./term/term.effects";
import { EnrollmentEffects } from "./enrollment/enrollment.effects";
import { SectionEffects } from "./section/section.effects";
import { studentFeatureKey, studentReducers } from "./index";
import { StudentEffects } from "./student/student.effects";

@NgModule({
	declarations: [],
	imports: [
		StoreModule.forFeature(studentFeatureKey, studentReducers),
		EffectsModule.forFeature([TermEffects, SectionEffects, EnrollmentEffects, StudentEffects]),
	],
})
export class StudentStoreModule {
}
