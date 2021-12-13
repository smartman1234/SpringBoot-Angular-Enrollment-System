import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cacheable } from "@datorama/akita";
import { tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { EMPTY, Observable } from "rxjs";
import { QueryParamOperator } from "../../../../core/constants/query-param-operator.enum";
import { AbstractGenericCrudService, Pageable } from "../../../../core/services/generic-crud.service";
import { ConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { AdminSection } from "./admin-section.model";
import { AdminSectionStore } from "./admin-section.store";
import { AdminSectionCreateComponent } from "../admin-section-create/admin-section-create.component";
import { AdminSectionEditComponent } from "../admin-section-edit/admin-section-edit.component";

@Injectable({ providedIn: "root" })
export class AdminSectionService extends AbstractGenericCrudService<AdminSection, string> {

	constructor(
		protected http: HttpClient,
		private adminSectionStore: AdminSectionStore,
		private dialog: MatDialog,
		private errorLogService: ErrorLogService,
		private notificationService: NotificationService,
	) {
		super(http, "/admin/sections");
	}

	termCourseIds = new Set();
	termName: string = "";
	subjectAcronym: string = "";
	pageable = {
		...this.defaultPageable,
		sort: ["sectionNumber"],
	};

	protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
		this.errorLogService.openErrorMessages(errorResponse);
		return EMPTY;
	}

	getAll(termId: string, courseId: string) {
		let httpParams = new HttpParams()
			.append(`term.id`, termId)
			.append(`course.id`, courseId);

		const readAll$ = this.readAll(httpParams).pipe(tap(entities => {
			this.adminSectionStore.add(entities);
		}));

		if (this.termCourseIds.has(termId + courseId)) {
			return EMPTY;
		} else {
			this.termCourseIds.add(termId + courseId);
			return readAll$;
		}
	}

	getPage(termName?: string, subjectAcronym?: string, pageable?: Pageable) {
		this.termName = termName ? termName : this.termName;
		this.subjectAcronym = subjectAcronym ? subjectAcronym : this.subjectAcronym;
		this.pageable = { ...this.pageable, ...pageable };
		if ((this.pageable.sort.indexOf("sectionNumber") !== -1
			|| this.pageable.sort.indexOf("sectionNumber,asc") !== -1)
			&& this.pageable.sort.indexOf("course.courseCode") === -1) {
			this.pageable.sort.unshift("course.courseCode");
		}

		let httpParams = new HttpParams({ fromObject: { ...this.pageable } })
			.append(`term.termName`, this.termName)
			.append(`course.subject.subjectAcronym`, this.subjectAcronym);
		this.readPage(httpParams).pipe(
			tap(sectionPage => this.adminSectionStore.update({ sectionPage })),
		).subscribe();
	}

	createSection() {
		const dialogRef = this.dialog.open(AdminSectionCreateComponent, { width: "70rem" });
		dialogRef.afterClosed().subscribe((formValue: AdminSection) => {
			if (formValue) {
				this.create(formValue).subscribe(section => {
					this.notificationService.open("New Section Created!", 2000);
					this.adminSectionStore.add(section);
					this.getPage();
				});
			}
		});
	}

	editSection(section: AdminSection) {
		const dialogRef = this.dialog.open(AdminSectionEditComponent, {
			data: { section },
			width: "70rem",
		});
		dialogRef.afterClosed().subscribe((formValue: AdminSection) => {
			if (formValue) {
				this.update(formValue, section.id).subscribe(section => {
					this.notificationService.open("Changes Saved!", 2000);
					this.adminSectionStore.update(section.id, section);
					this.getPage();
				});
			}
		});
	}

	deleteSection(section: AdminSection) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: "50rem",
				data: {
					message: "Do you want to remove section " + section.courseCode
						+ "." + section.sectionNumber.toString().padStart(2, "0") + "?",
				},
			},
		);

		dialogRef.afterClosed().subscribe(confirm => {
			if (confirm === true) {
				this.delete(section.id).subscribe(() => {
					this.notificationService.open("Section Deleted!", 2000);
					this.adminSectionStore.remove(section.id);
					this.getPage();
				});
			}
		});
	}

}
