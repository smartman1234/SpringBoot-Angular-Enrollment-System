import { NgModule } from "@angular/core";

import { AdminRoutingModule } from "./admin-routing.module";
import { SharedModule } from "../../shared/module/shared.module";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { CoreModule } from "../../core/core.module";
import { AdminCourseModule } from "./admin-course/admin-course.module";
import { AdminCollegeModule } from "./admin-college/admin-college.module";
import { AdminSubjectModule } from "./admin-subject/admin-subject.module";
import { AdminBuildingModule } from "./admin-building/admin-building.module";
import { AdminRoomModule } from "./admin-room/admin-room.module";
import { AdminDepartmentModule } from "./admin-department/admin-department.module";
import { AdminInstructorModule } from "./admin-instructor/admin-instructor.module";
import { AdminTermModule } from "./admin-term/admin-term.module";
import { AdminSectionModule } from "./admin-section/admin-section.module";
import { AdminStudentModule } from "./admin-student/admin-student.module";
import { AdminUserModule } from "./admin-user/admin-user.module";
import { AdminAuthorityModule } from "./admin-authority/admin-authority.module";
import { AdminComponent } from "./admin.component";
import { AdminEnrollmentListComponent } from './admin-enrollment/admin-enrollment-list/admin-enrollment-list.component';
import { AdminEnrollmentCreateComponent } from './admin-enrollment/admin-enrollment-create/admin-enrollment-create.component';
import { AdminEnrollmentEditComponent } from './admin-enrollment/admin-enrollment-edit/admin-enrollment-edit.component';


@NgModule({
	imports: [
		SharedModule,
		CoreModule,
		AdminCourseModule,
		AdminCollegeModule,
		AdminSubjectModule,
		AdminBuildingModule,
		AdminRoomModule,
		AdminDepartmentModule,
		AdminInstructorModule,
		AdminTermModule,
		AdminSectionModule,
		AdminStudentModule,
		AdminUserModule,
		AdminAuthorityModule,
		AdminRoutingModule,
	],
	declarations: [
		AdminDashboardComponent,
		AdminComponent,
  AdminEnrollmentListComponent,
  AdminEnrollmentCreateComponent,
  AdminEnrollmentEditComponent,
	],
})
export class AdminModule {
}
