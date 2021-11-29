import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AbstractGenericCrudService } from "../../../../../core/services/generic-crud.service";
import { Student } from "./student.model";
import { StudentStore } from "./student.store";
import { catchError, tap } from "rxjs/operators";
import { cacheable } from "@datorama/akita";
import { EMPTY, throwError } from "rxjs";
import { ErrorNotificationService } from "../../../../../core/services/error-notification.service";

@Injectable({ providedIn: "root" })
export class StudentService extends AbstractGenericCrudService<Student, string> {

	constructor(
		protected http: HttpClient,
		private studentStore: StudentStore,
		private errorNotificationService: ErrorNotificationService,
	) {
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

	getStudent(studentId: string) {
		const readOne$ = this.readOne(studentId).pipe(
			tap(student => this.studentStore.update({ ...student })),
			catchError(errorResponse => {
				this.errorNotificationService.open(errorResponse);
				return throwError(errorResponse);
			}),
		);

		cacheable(this.studentStore, readOne$).subscribe();
	}

}
