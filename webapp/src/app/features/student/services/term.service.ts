import { Injectable } from "@angular/core";
import { AbstractGenericCrudService } from "../../../core/services/generic-crud.service";
import { Term } from "../models/term.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: "root",
})
export class TermService extends AbstractGenericCrudService<Term, string> {

	constructor(protected http: HttpClient) {
		super(http, "/terms", {
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
