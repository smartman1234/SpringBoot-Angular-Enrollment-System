import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "./subject.model";
import { AbstractGenericCrudService } from "../../../../../core/services/generic-crud.service";
import { cacheable } from "@datorama/akita";
import { SubjectStore } from "./subject.store";
import { tap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class SubjectService extends AbstractGenericCrudService<Subject, string> {

	constructor(
		protected http: HttpClient,
		private subjectStore: SubjectStore,
	) {
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

	getAll() {
		const readAll$ = this.readAll().pipe(
			tap(subjects => this.subjectStore.set(subjects)),
		);
		cacheable(this.subjectStore, readAll$).subscribe();
	}

}
