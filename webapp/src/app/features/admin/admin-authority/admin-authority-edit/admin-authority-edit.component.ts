import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AdminCourse } from "../../admin-course/state/admin-course.model";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminSubjectService } from "../../admin-subject/state/admin-subject.service";
import { AdminSubjectQuery } from "../../admin-subject/state/admin-subject.query";
import { Observable } from "rxjs";
import { AdminSubject } from "../../admin-subject/state/admin-subject.model";
import { AdminAuthority } from "../state/admin-authority.model";

@Component({
  selector: 'app-admin-authority-edit',
  templateUrl: './admin-authority-edit.component.html',
  styleUrls: ['./admin-authority-edit.component.scss']
})
export class AdminAuthorityEditComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminAuthorityEditComponent>,
		private formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: { authority: AdminAuthority },
	) {
	}

	ngOnInit(): void {
	}

	saveEdit() {
		this.dialogRef.close({
			id: this.data.authority.id,
			role: this.role.value,
		});
	}

	authorityForm = this.formBuilder.group({
		role: [this.data.authority.role, { validators: [Validators.required] }],
	});

	get role() {
		return this.authorityForm.get("role") as FormControl;
	}
}
