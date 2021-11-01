import { SectionBase } from "./section.model";

export interface Enrollment extends SectionBase {
	studentId: string,
	sectionId: string,
	enrollmentStatus: string,
	accessCode?: string,
}
