import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { AdminSection } from "../state/admin-section.model";
import { PageEvent } from "@angular/material/paginator";
import { AdminBuilding } from "../../admin-building/state/admin-building.model";
import { AdminRoom } from "../../admin-room/state/admin-room.model";
import { Page } from "../../../../core/models/page.model";
import { AdminInstructor } from "../../admin-instructor/state/admin-instructor.model";
import { emptyPage } from "../../../../core/constants/empty-page-slice";
import { AdminDepartment } from "../../admin-department/state/admin-department.model";
import { SectionStatus } from "../../../../core/constants/section-status";
import { AdminBuildingService } from "../../admin-building/state/admin-building.service";
import { AdminBuildingQuery } from "../../admin-building/state/admin-building.query";
import { AdminRoomService } from "../../admin-room/state/admin-room.service";
import { AdminRoomQuery } from "../../admin-room/state/admin-room.query";
import { AdminDepartmentService } from "../../admin-department/state/admin-department.service";
import { AdminDepartmentQuery } from "../../admin-department/state/admin-department.query";
import { AdminInstructorService } from "../../admin-instructor/state/admin-instructor.service";
import { tap } from "rxjs/operators";

@Component({
	selector: "app-admin-section-edit",
	templateUrl: "./admin-section-edit.component.html",
	styleUrls: ["./admin-section-edit.component.scss"],
})
export class AdminSectionEditComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminSectionEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { section: AdminSection },
		private formBuilder: FormBuilder,
		private adminBuildingService: AdminBuildingService,
		private adminBuildingQuery: AdminBuildingQuery,
		private adminRoomService: AdminRoomService,
		private adminRoomQuery: AdminRoomQuery,
		private adminDepartmentService: AdminDepartmentService,
		private adminDepartmentQuery: AdminDepartmentQuery,
		private adminInstructorService: AdminInstructorService,
	) {
	}

	buildings$!: Observable<AdminBuilding[]>;
	rooms$!: Observable<AdminRoom[]>;
	instructorPage: Page<AdminInstructor> = emptyPage;
	department$!: Observable<AdminDepartment[]>;

	sectionStatuses: string[] = Object.values(SectionStatus);

	ngOnInit(): void {
		this.buildings$ = this.adminBuildingQuery.adminBuildings$.pipe(
			tap((adminBuildings) => {
				const currentAdminBuilding = adminBuildings
					.find(adminBuilding => adminBuilding.buildingNumber === this.data.section.buildingNumber);
				this.building.setValue(currentAdminBuilding);
				this.getRooms();
			}),
		);
		this.adminBuildingService.getAll().subscribe();
		this.rooms$ = this.adminRoomQuery.adminRooms$;

		this.department$ = this.adminDepartmentQuery.adminDepartments$;
		this.adminDepartmentService.getAll().subscribe();
	}

	getRooms() {
		if (this.building.value) {
			this.adminRoomService.getAll(this.building.value.buildingNumber).subscribe();
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

	saveEdit() {
		this.dialogRef.close({
			id: this.data.section.id,
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
			roomId: this.roomId.value,
			instructorId: this.instructorId.value,
		});
	}

	sectionForm = this.formBuilder.group({
		meetingDays: [this.data.section.meetingDays, { validators: [Validators.required, Validators.max(50)] }],
		meetingTimeStart: [this.data.section.meetingTimeStart, { validators: [Validators.required] }],
		meetingTimeEnd: [this.data.section.meetingTimeEnd, { validators: [Validators.required] }],
		classCapacity: [this.data.section.classCapacity, { validators: [Validators.required] }],
		waitlistCapacity: [this.data.section.waitlistCapacity, { validators: [Validators.required] }],
		enrolledNumber: [this.data.section.enrolledNumber, { validators: [Validators.required] }],
		waitingNumber: [this.data.section.waitingNumber, { validators: [Validators.required] }],
		dateStart: [this.data.section.dateStart, { validators: [Validators.required] }],
		dateEnd: [this.data.section.dateEnd, { validators: [Validators.required] }],
		sectionStatus: [this.data.section.sectionStatus, { validators: [Validators.required, Validators.max(20)] }],
		roomId: [this.data.section.roomId, { validators: [Validators.required] }],
		instructorId: [{
			value: this.data.section.instructorId,
			disabled: true,
		}, { validators: [Validators.required] }],
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

	get roomId() {
		return this.sectionForm.get("roomId") as FormControl;
	}

	get instructorId() {
		return this.sectionForm.get("instructorId") as FormControl;
	}

	get building() {
		return this.sectionForm.get("building") as FormControl;
	}

	get department() {
		return this.sectionForm.get("department") as FormControl;
	}

}
