import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminSubjectService } from "../../admin-subject/state/admin-subject.service";
import { AdminSubjectQuery } from "../../admin-subject/state/admin-subject.query";
import { Observable } from "rxjs";
import { AdminSubject } from "../../admin-subject/state/admin-subject.model";
import { AdminTerm } from "../../admin-term/state/admin-term.model";
import { AdminTermService } from "../../admin-term/state/admin-term.service";
import { AdminTermQuery } from "../../admin-term/state/admin-term.query";
import { SectionStatus } from "../../../../core/constants/section-status";
import { AdminCourse } from "../../admin-course/state/admin-course.model";
import { AdminCourseService } from "../../admin-course/state/admin-course.service";
import { AdminCourseQuery } from "../../admin-course/state/admin-course.query";
import { AdminBuilding } from "../../admin-building/state/admin-building.model";
import { AdminBuildingService } from "../../admin-building/state/admin-building.service";
import { AdminBuildingQuery } from "../../admin-building/state/admin-building.query";
import { AdminRoom } from "../../admin-room/state/admin-room.model";
import { AdminRoomService } from "../../admin-room/state/admin-room.service";
import { AdminRoomQuery } from "../../admin-room/state/admin-room.query";
import { AdminInstructorService } from "../../admin-instructor/state/admin-instructor.service";
import { Page } from "../../../../core/models/page.model";
import { emptyPage } from "../../../../core/constants/empty-page-slice";
import { AdminInstructor } from "../../admin-instructor/state/admin-instructor.model";
import { AdminDepartmentService } from "../../admin-department/state/admin-department.service";
import { AdminDepartmentQuery } from "../../admin-department/state/admin-department.query";
import { AdminDepartment } from "../../admin-department/state/admin-department.model";
import { PageEvent } from "@angular/material/paginator";
import { tap } from "rxjs/operators";

@Component({
	selector: "app-admin-section-create",
	templateUrl: "./admin-section-create.component.html",
	styleUrls: ["./admin-section-create.component.scss"],
})
export class AdminSectionCreateComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminSectionCreateComponent>,
		private formBuilder: FormBuilder,
		private adminTermService: AdminTermService,
		private adminTermQuery: AdminTermQuery,
		private adminSubjectService: AdminSubjectService,
		private adminSubjectQuery: AdminSubjectQuery,
		private adminCourseService: AdminCourseService,
		private adminCourseQuery: AdminCourseQuery,
		private adminBuildingService: AdminBuildingService,
		private adminBuildingQuery: AdminBuildingQuery,
		private adminRoomService: AdminRoomService,
		private adminRoomQuery: AdminRoomQuery,
		private adminDepartmentService: AdminDepartmentService,
		private adminDepartmentQuery: AdminDepartmentQuery,
		private adminInstructorService: AdminInstructorService,
	) {
	}

	terms$!: Observable<AdminTerm[]>;
	subjects$!: Observable<AdminSubject[]>;
	courses$!: Observable<AdminCourse[]>;
	buildings$!: Observable<AdminBuilding[]>;
	rooms$!: Observable<AdminRoom[]>;
	instructorPage: Page<AdminInstructor> = emptyPage;
	department$!: Observable<AdminDepartment[]>;

	sectionStatuses: string[] = Object.values(SectionStatus);

	ngOnInit(): void {
		this.terms$ = this.adminTermQuery.adminTerms$;
		this.adminTermService.getAll().subscribe();

		this.subjects$ = this.adminSubjectQuery.adminSubjects$;
		this.adminSubjectService.getAll().subscribe();

		this.buildings$ = this.adminBuildingQuery.adminBuildings$;
		this.adminBuildingService.getAll().subscribe();

		this.department$ = this.adminDepartmentQuery.adminDepartments$;
		this.adminDepartmentService.getAll().subscribe();

		this.rooms$ = this.adminRoomQuery.adminRooms$;
	}

	getCourses() {
		this.adminCourseService.getAll(this.subject.value.subjectAcronym).subscribe();
		this.courses$ = this.adminCourseQuery.adminCoursesBySubject(this.subject.value.id)
			.pipe(tap(adminCourses => {
				if (adminCourses.length > 0) {
					this.courseId.enable();
				}
			}));
	}

	getRooms() {
		if (this.building.value) {
			this.adminRoomService.getAll(this.building.value.buildingNumber).subscribe(() => {
				this.roomId.enable();
			});
		}
	}

	getInstructorPage(page: number = 0) {
		const pageable = {
			page,
			size: 20,
			sort: ["email"],
		};
		this.adminInstructorService
			.getPage2(pageable, this.department.value.departmentName)
			.subscribe(instructorPage => {
				this.instructorId.enable();
				this.instructorPage = instructorPage;
			});
	}

	onPageEvent(pageEvent: PageEvent) {
		this.instructorId.setValue("");
		this.getInstructorPage(pageEvent.pageIndex);
	}

	create() {
		this.dialogRef.close({
			meetingDays: this.meetingDays.value,
			meetingTimeStart: this.meetingTimeStart.value,
			meetingTimeEnd: this.meetingTimeEnd.value,
			classCapacity: this.classCapacity.value,
			waitlistCapacity: this.waitlistCapacity.value,
			enrolledNumber: this.enrolledNumber.value,
			waitingNumber: this.waitingNumber.value,
			dateStart: this.dateStart.value,
			dateEnd: this.dateEnd.value,
			sectionStatus: this.sectionStatus.value,
			termId: this.termId.value,
			courseId: this.courseId.value,
			roomId: this.roomId.value,
			instructorId: this.instructorId.value,
		});
	}

	sectionForm = this.formBuilder.group({
		meetingDays: ["", { validators: [Validators.required, Validators.max(50)] }],
		meetingTimeStart: ["", { validators: [Validators.required] }],
		meetingTimeEnd: ["", { validators: [Validators.required] }],
		classCapacity: ["", { validators: [Validators.required] }],
		waitlistCapacity: ["", { validators: [Validators.required] }],
		enrolledNumber: ["", { validators: [Validators.required] }],
		waitingNumber: ["", { validators: [Validators.required] }],
		dateStart: ["", { validators: [Validators.required] }],
		dateEnd: ["", { validators: [Validators.required] }],
		sectionStatus: ["", { validators: [Validators.required, Validators.max(20)] }],
		termId: ["", { validators: [Validators.required] }],
		courseId: [{ value: "", disabled: true }, { validators: [Validators.required] }],
		roomId: [{ value: "", disabled: true }, { validators: [Validators.required] }],
		instructorId: [{ value: "", disabled: true }, { validators: [Validators.required] }],
		subject: ["", { validators: [Validators.required] }],
		building: ["", { validators: [Validators.required] }],
		department: ["", { validators: [Validators.required] }],
	});

	get meetingDays() {
		return this.sectionForm.get("meetingDays") as FormControl;
	}

	get meetingTimeStart() {
		return this.sectionForm.get("meetingTimeStart") as FormControl;
	}

	get meetingTimeEnd() {
		return this.sectionForm.get("meetingTimeEnd") as FormControl;
	}

	get classCapacity() {
		return this.sectionForm.get("classCapacity") as FormControl;
	}

	get waitlistCapacity() {
		return this.sectionForm.get("waitlistCapacity") as FormControl;
	}

	get enrolledNumber() {
		return this.sectionForm.get("enrolledNumber") as FormControl;
	}

	get waitingNumber() {
		return this.sectionForm.get("waitingNumber") as FormControl;
	}

	get dateStart() {
		return this.sectionForm.get("dateStart") as FormControl;
	}

	get dateEnd() {
		return this.sectionForm.get("dateEnd") as FormControl;
	}

	get sectionStatus() {
		return this.sectionForm.get("sectionStatus") as FormControl;
	}

	get termId() {
		return this.sectionForm.get("termId") as FormControl;
	}

	get courseId() {
		return this.sectionForm.get("courseId") as FormControl;
	}

	get roomId() {
		return this.sectionForm.get("roomId") as FormControl;
	}

	get instructorId() {
		return this.sectionForm.get("instructorId") as FormControl;
	}

	get subject() {
		return this.sectionForm.get("subject") as FormControl;
	}

	get building() {
		return this.sectionForm.get("building") as FormControl;
	}

	get department() {
		return this.sectionForm.get("department") as FormControl;
	}
}
