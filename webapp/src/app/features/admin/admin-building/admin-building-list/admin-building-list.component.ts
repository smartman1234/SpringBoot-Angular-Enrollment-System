import { Component, OnInit, TrackByFunction } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { ScrollToTopService } from "../../../../core/services/scroll-to-top.service";
import { Observable } from "rxjs";
import { Page } from "../../../../core/models/page.model";
import { Sort, SortDirection } from "@angular/material/sort";
import { Pageable } from "../../../../core/services/generic-crud.service";
import { PageEvent } from "@angular/material/paginator";
import { AdminBuildingService } from "../state/admin-building.service";
import { AdminBuildingQuery } from "../state/admin-building.query";
import { AdminBuilding } from "../state/admin-building.model";
import { take } from "rxjs/operators";

@Component({
	selector: "app-admin-building-list",
	templateUrl: "./admin-building-list.component.html",
	styleUrls: ["./admin-building-list.component.scss"],
})
export class AdminBuildingListComponent implements OnInit {

	constructor(
		private formBuilder: FormBuilder,
		private adminBuildingService: AdminBuildingService,
		private adminBuildingQuery: AdminBuildingQuery,
		private errorLogService: ErrorLogService,
		private scrollToTopService: ScrollToTopService,
	) {
	}

	title: string = "Building";
	subtitle: string = "Building List";
	buildingPage$!: Observable<Page<AdminBuilding>>;
	sortActive: string = "";
	sortDirection: SortDirection = "asc";

	displayedColumns: string[] = ["id", "buildingNumber", "buildingName", "buildingCode", "edit", "delete"];

	ngOnInit(): void {
		const sort = this.adminBuildingService.pageable.sort[0].split(",");
		this.sortActive = sort[0];
		this.sortDirection = sort.length > 1 ? sort[1] as SortDirection : "asc";

		this.buildingPage$ = this.adminBuildingQuery.adminBuildingPage$;

		this.adminBuildingQuery.select(building => building.buildingPage).pipe(
			take(1),
		).subscribe(buildingPage => {
			if (buildingPage.empty) {
				this.getBuildingPage();
			}
		});
	}

	getBuildingPage(pageable?: Pageable) {
		this.adminBuildingService.getPage(pageable);
	}

	onSortChange(sort: Sort) {
		this.getBuildingPage({
			page: 0,
			sort: [sort.active.concat(",").concat(sort.direction)],
		});
	}

	onPageEvent(pageEvent: PageEvent) {
		this.getBuildingPage({
			page: pageEvent.pageIndex,
			size: pageEvent.pageSize,
		});
		this.scrollToTopService.toTop("content", 50);
	}

	createBuilding() {
		this.adminBuildingService.createBuilding();
	}

	editBuilding(building: AdminBuilding) {
		this.adminBuildingService.editBuilding(building);
	}

	deleteBuilding(building: AdminBuilding) {
		this.adminBuildingService.deleteBuilding(building);
	}

	openErrorMessages(errorResponse?: any) {
		this.errorLogService.openErrorMessages(errorResponse);
	}

	asBuilding(value: any): AdminBuilding {
		return value as AdminBuilding;
	}

	trackBuilding: TrackByFunction<AdminBuilding> = (index: number, building: AdminBuilding): string => {
		return building.id;
	};

}
