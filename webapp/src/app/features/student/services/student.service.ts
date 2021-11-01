import { Injectable } from "@angular/core";
import { AbstractGenericCrudService } from "../../../core/services/generic-crud.service";
import { Student } from "../models/student.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: "root",
})
export class StudentService extends AbstractGenericCrudService<Student, string> {

	constructor(protected http: HttpClient) {
		super(http, "/students", {
			readAll: false,
			readPage: false,
			readSlice: false,
			create: false,
			update: false,
			updatePartial: false,
			delete: false,
		});
	}
}
