import { Component, OnInit, TrackByFunction } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { ScrollToTopService } from "../../../../core/services/scroll-to-top.service";
import { Observable } from "rxjs";
import { Page } from "../../../../core/models/page.model";
import { Sort, SortDirection } from "@angular/material/sort";
import { take } from "rxjs/operators";
import { Pageable } from "../../../../core/services/generic-crud.service";
import { PageEvent } from "@angular/material/paginator";
import { AdminAuthority } from "../state/admin-authority.model";
import { AdminAuthorityService } from "../state/admin-authority.service";
import { AdminAuthorityQuery } from "../state/admin-authority.query";

@Component({
	selector: "app-admin-authority-list",
	templateUrl: "./admin-authority-list.component.html",
	styleUrls: ["./admin-authority-list.component.scss"],
})
export class AdminAuthorityListComponent implements OnInit {

	constructor(
		private formBuilder: FormBuilder,
		private adminAuthorityService: AdminAuthorityService,
		private adminAuthorityQuery: AdminAuthorityQuery,
		private errorLogService: ErrorLogService,
		private scrollToTopService: ScrollToTopService,
	) {
	}

	title: string = "Authority";
	subtitle: string = "Authority List";
	authorityPage$!: Observable<Page<AdminAuthority>>;
	sortActive: string = "";
	sortDirection: SortDirection = "asc";

	displayedColumns: string[] = ["id", "role", "edit", "delete"];

	ngOnInit(): void {
		const sort = this.adminAuthorityService.pageable.sort[0].split(",");
		this.sortActive = sort[0];
		this.sortDirection = sort.length > 1 ? sort[1] as SortDirection : "asc";

		this.authorityPage$ = this.adminAuthorityQuery.adminAuthorityPage$;

		this.adminAuthorityQuery.select(authority => authority.authorityPage).pipe(
			take(1),
		).subscribe(authorityPage => {
			if (authorityPage.empty) {
				this.getAuthorityPage();
			}
		});
	}

	getAuthorityPage(pageable?: Pageable) {
		this.adminAuthorityService.getPage(pageable);
	}

	onSortChange(sort: Sort) {
		this.getAuthorityPage({
			page: 0,
			sort: [sort.active.concat(",").concat(sort.direction)],
		});
	}

	onPageEvent(pageEvent: PageEvent) {
		this.getAuthorityPage({
			page: pageEvent.pageIndex,
			size: pageEvent.pageSize,
		});
		this.scrollToTopService.toTop("content", 50);
	}

	createAuthority() {
		this.adminAuthorityService.createAuthority();
	}

	editAuthority(authority: AdminAuthority) {
		this.adminAuthorityService.editAuthority(authority);
	}

	deleteAuthority(authority: AdminAuthority) {
		this.adminAuthorityService.deleteAuthority(authority);
	}

	openErrorMessages(errorResponse?: any) {
		this.errorLogService.openErrorMessages(errorResponse);
	}

	asAuthority(value: any): AdminAuthority {
		return value as AdminAuthority;
	}

	trackAuthority: TrackByFunction<AdminAuthority> = (index: number, authority: AdminAuthority): string => {
		return authority.id;
	};

}
