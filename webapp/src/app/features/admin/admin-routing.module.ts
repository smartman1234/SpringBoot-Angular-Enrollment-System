import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageNotFoundComponent } from "../../core/components/page-not-found/page-not-found.component";
import { AdminGuard } from "../../core/guards/admin.guard";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { AdminCourseListComponent } from "./admin-course/admin-course-list/admin-course-list.component";
import { AdminCollegeListComponent } from "./admin-college/admin-college-list/admin-college-list.component";
import { AdminComponent } from "./admin.component";
import { AdminBuildingListComponent } from "./admin-building/admin-building-list/admin-building-list.component";
import { AdminTermListComponent } from "./admin-term/admin-term-list/admin-term-list.component";
import { AdminAuthorityListComponent } from "./admin-authority/admin-authority-list/admin-authority-list.component";
import { AdminDepartmentListComponent } from "./admin-department/admin-department-list/admin-department-list.component";
import { AdminRoomListComponent } from "./admin-room/admin-room-list/admin-room-list.component";
import { AdminSubjectListComponent } from "./admin-subject/admin-subject-list/admin-subject-list.component";
import { AdminUserListComponent } from "./admin-user/admin-user-list/admin-user-list.component";
import { AdminInstructorListComponent } from "./admin-instructor/admin-instructor-list/admin-instructor-list.component";
import { AdminStudentListComponent } from "./admin-student/admin-student-list/admin-student-list.component";
import { AdminSectionListComponent } from "./admin-section/admin-section-list/admin-section-list.component";
import { AdminEnrollmentListComponent } from "./admin-enrollment/admin-enrollment-list/admin-enrollment-list.component";

const routes: Routes = [
	{
		path: "",
		canActivateChild: [AdminGuard],
		component: AdminComponent,
		children: [
			{
				path: "dashboard",
				component: AdminDashboardComponent,
				children: [
					{ path: "authority", component: AdminAuthorityListComponent },
					{ path: "building", component: AdminBuildingListComponent },
					{ path: "college", component: AdminCollegeListComponent },
					{ path: "course", component: AdminCourseListComponent },
					{ path: "department", component: AdminDepartmentListComponent },
					{ path: "enrollment", component: AdminEnrollmentListComponent },
					{ path: "instructor", component: AdminInstructorListComponent },
					{ path: "room", component: AdminRoomListComponent },
					{ path: "section", component: AdminSectionListComponent },
					{ path: "student", component: AdminStudentListComponent },
					{ path: "subject", component: AdminSubjectListComponent },
					{ path: "term", component: AdminTermListComponent },
					{ path: "user", component: AdminUserListComponent },
					{ path: "", redirectTo: "/admin/dashboard/authority", pathMatch: "full" },
					{ path: "**", component: PageNotFoundComponent },
				],
			},
			{ path: "", redirectTo: "/admin/dashboard/authority", pathMatch: "full" },
			{ path: "**", component: PageNotFoundComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AdminRoutingModule {
}
