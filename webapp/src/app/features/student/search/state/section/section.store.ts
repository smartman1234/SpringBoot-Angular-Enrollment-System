import { Injectable } from "@angular/core";
import { Store, StoreConfig } from "@datorama/akita";
import { Page } from "../../../../../core/models/page.model";
import { emptyPage } from "../../../../../core/constants/empty-page-slice";
import { CourseSection } from "./course-section.model";

export interface SectionState extends Page<CourseSection> {
}

export const initialSectionState = (): SectionState => emptyPage;

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "section" })
export class SectionStore extends Store<SectionState> {

	constructor() {
		super(initialSectionState());
	}

}
