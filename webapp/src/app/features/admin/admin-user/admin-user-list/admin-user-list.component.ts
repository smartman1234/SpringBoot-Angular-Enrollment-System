import { Component, OnInit, TrackByFunction } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminAuthorityService } from "../../admin-authority/state/admin-authority.service";
import { AdminAuthorityQuery } from "../../admin-authority/state/admin-authority.query";
import { AdminAuthorityStore } from "../../admin-authority/state/admin-authority.store";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { ScrollToTopService } from "../../../../core/services/scroll-to-top.service";
import { Observable } from "rxjs";
import { AdminAuthority } from "../../admin-authority/state/admin-authority.model";
import { Page } from "../../../../core/models/page.model";
import { Sort, SortDirection } from "@angular/material/sort";
import { filter, takeUntil } from "rxjs/operators";
import { Pageable } from "../../../../core/services/generic-crud.service";
import { PageEvent } from "@angular/material/paginator";
import { AdminUserService } from "../state/admin-user.service";
import { AdminUserQuery } from "../state/admin-user.query";
import { AdminUser } from "../state/admin-user.model";
import { UnsubscribeComponent } from "../../../../core/components/unsubscribe/unsubscribe.component";
import { combineQueries } from "@datorama/akita";

@Component({
	selector: "app-admin-user-list",
	templateUrl: "./admin-user-list.component.html",
	styleUrls: ["./admin-user-list.component.scss"],
})
export class AdminUserListComponent extends UnsubscribeComponent implements OnInit {

	constructor(
		private formBuilder: FormBuilder,
		private adminUserService: AdminUserService,
		private adminUserQuery: AdminUserQuery,
		private adminAuthorityService: AdminAuthorityService,
		private adminAuthorityQuery: AdminAuthorityQuery,
		private adminAuthorityStore: AdminAuthorityStore,
		private errorLogService: ErrorLogService,
		private scrollToTopService: ScrollToTopService,
	) {
		super();
	}

	title: string = "User";
	subtitle: string = "User List";
	authorities$!: Observable<AdminAuthority[]>;
	userPage$!: Observable<Page<AdminUser>>;
	sortActive: string = "";
	sortDirection: SortDirection = "asc";

	displayedColumns: string[] = ["id", "username", "enabled", "firstName", "lastName",
		"authorities", "changePassword", "edit", "delete"];

	authoritiesForm = this.formBuilder.group({
		authorities: [[], { validators: [Validators.required] }],
	});

	get authorities() {
		return this.authoritiesForm.get("authorities") as FormControl;
	}

	ngOnInit(): void {
		const sort = this.adminUserService.pageable.sort[0].split(",");
		this.sortActive = sort[0];
		this.sortDirection = sort.length > 1 ? sort[1] as SortDirection : "asc";

		this.userPage$ = this.adminUserQuery.adminUserPage$;
		this.authorities$ = this.adminAuthorityQuery.adminAuthorities$;

		this.adminAuthorityService.getAll().subscribe();
		combineQueries([
			this.adminAuthorityQuery.selectAll().pipe(filter(authorities => authorities.length > 0)),
			this.adminAuthorityQuery.selectActiveId(),
		]).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(([authorities, activeAuthorities]) => {
			this.unsubscribe$.next();
			this.unsubscribe$.complete();
			if (activeAuthorities && activeAuthorities.length > 0) {
				this.authorities.setValue(activeAuthorities);
			} else {
				this.authorities.setValue(authorities);
				this.getUserPage();
			}
		});
	}

	getUserPage(pageable?: Pageable) {
		if (this.authorities.value) {
			const roles = this.authorities.value.map((authority: AdminAuthority) => authority.role);
			this.adminAuthorityStore.setActive(this.authorities.value);
			this.adminUserService.getPage(roles, pageable);
		}
	}

	onSortChange(sort: Sort) {
		this.getUserPage({
			page: 0,
			sort: [sort.active.concat(",").concat(sort.direction)],
		});
	}

	onPageEvent(pageEvent: PageEvent) {
		this.getUserPage({
			page: pageEvent.pageIndex,
			size: pageEvent.pageSize,
		});
		this.scrollToTopService.toTop("content", 50);
	}

	createUser() {
		this.adminUserService.createUser();
	}

	editUser(user: AdminUser) {
		this.adminUserService.editUser(user);
	}

	changePassword(userId: string) {
		this.adminUserService.changePassword(userId);
	}

	deleteUser(user: AdminUser) {
		this.adminUserService.deleteUser(user);
	}

	openErrorMessages(errorResponse?: any) {
		this.errorLogService.openErrorMessages(errorResponse);
	}

	authoritiesToRoles(authorities: AdminAuthority[]): string {
		return authorities.map(authority => authority.role).join(", ");
	}

	asUser(value: any): AdminUser {
		return value as AdminUser;
	}

	trackUser: TrackByFunction<AdminUser> = (index: number, user: AdminUser): string => {
		return user.id;
	};
}
