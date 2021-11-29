import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Term } from "./term.model";
import { AbstractGenericCrudService } from "../../../../../core/services/generic-crud.service";
import { tap } from "rxjs/operators";
import { cacheable } from "@datorama/akita";
import { TermStore } from "./term.store";

@Injectable({ providedIn: "root" })
export class TermService extends AbstractGenericCrudService<Term, string> {

	constructor(
		protected http: HttpClient,
		private termStore: TermStore,
	) {
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

	getAll() {
		const readAll$ = this.readAll().pipe(
			tap(subjects => this.termStore.set(subjects)),
		);
		cacheable(this.termStore, readAll$).subscribe();
	}

}
