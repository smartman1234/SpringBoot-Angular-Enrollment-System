import { Injectable } from "@angular/core";
import { AbstractGenericCrudService } from "../../../core/services/generic-crud.service";
import { HttpClient } from "@angular/common/http";
import { Subject } from "../models/subject.model";

@Injectable({
	providedIn: "root",
})
export class SubjectService extends AbstractGenericCrudService<Subject, string> {

	constructor(protected http: HttpClient) {
		super(http, "/subjects", {
			readOne: false,
			readPage: false,
			readSlice: false,
			create: false,
			update: false,
			updatePartial: false,
			delete: false,
		});
	}
}
