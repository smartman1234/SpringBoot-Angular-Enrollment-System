import { Section } from "./section.model";

export interface CourseSection {
	courseCode: string,
	courseName: string,
	courseId: string,
	sections: Array<Section>,
}
