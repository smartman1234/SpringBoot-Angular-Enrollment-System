import { Component, OnInit, TrackByFunction } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminBuildingService } from "../../admin-building/state/admin-building.service";
import { AdminBuildingQuery } from "../../admin-building/state/admin-building.query";
import { AdminBuildingStore } from "../../admin-building/state/admin-building.store";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { ScrollToTopService } from "../../../../core/services/scroll-to-top.service";
import { Observable } from "rxjs";
import { AdminBuilding } from "../../admin-building/state/admin-building.model";
import { Page } from "../../../../core/models/page.model";
import { Sort, SortDirection } from "@angular/material/sort";
import { filter, takeUntil } from "rxjs/operators";
import { Pageable } from "../../../../core/services/generic-crud.service";
import { PageEvent } from "@angular/material/paginator";
import { AdminRoom } from "../state/admin-room.model";
import { AdminRoomService } from "../state/admin-room.service";
import { AdminRoomQuery } from "../state/admin-room.query";
import { UnsubscribeComponent } from "../../../../core/components/unsubscribe/unsubscribe.component";
import { combineQueries } from "@datorama/akita";

@Component({
	selector: "app-admin-room-list",
	templateUrl: "./admin-room-list.component.html",
	styleUrls: ["./admin-room-list.component.scss"],
})
export class AdminRoomListComponent extends UnsubscribeComponent implements OnInit {

	constructor(
		private formBuilder: FormBuilder,
		private adminRoomService: AdminRoomService,
		private adminRoomQuery: AdminRoomQuery,
		private adminBuildingService: AdminBuildingService,
		private adminBuildingQuery: AdminBuildingQuery,
		private adminBuildingStore: AdminBuildingStore,
		private errorLogService: ErrorLogService,
		private scrollToTopService: ScrollToTopService,
	) {
		super();
	}

	title: string = "Room";
	subtitle: string = "Room List";
	buildings$!: Observable<AdminBuilding[]>;
	roomPage$!: Observable<Page<AdminRoom>>;
	sortActive: string = "";
	sortDirection: SortDirection = "asc";

	displayedColumns: string[] = ["id", "roomNumber", "roomCapacity",
		"buildingId", "edit", "delete"];

	buildingForm = this.formBuilder.group({
		building: ["", { validators: [Validators.required] }],
	});

	get building() {
		return this.buildingForm.get("building") as FormControl;
	}

	ngOnInit(): void {
		const sort = this.adminRoomService.pageable.sort[0].split(",");
		this.sortActive = sort[0];
		this.sortDirection = sort.length > 1 ? sort[1] as SortDirection : "asc";

		this.roomPage$ = this.adminRoomQuery.adminRoomPage$;
		this.buildings$ = this.adminBuildingQuery.adminBuildings$;

		this.adminBuildingService.getAll().subscribe();
		combineQueries([
			this.adminBuildingQuery.selectAll().pipe(filter(buildings => buildings.length > 0)),
			this.adminBuildingQuery.selectActive(),
		]).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(([buildings, activeBuilding]) => {
			this.unsubscribe$.next();
			this.unsubscribe$.complete();
			if (activeBuilding) {
				this.building.setValue(activeBuilding);
			} else {
				this.building.setValue(buildings[0]);
				this.getRoomPage();
			}
		});
	}

	getRoomPage(pageable?: Pageable) {
		if (this.building.value) {
			this.adminBuildingStore.setActive(this.building.value.id);
			this.adminRoomService.getPage(this.building.value.buildingNumber, pageable);
		}
	}

	onSortChange(sort: Sort) {
		this.getRoomPage({
			page: 0,
			sort: [sort.active.concat(",").concat(sort.direction)],
		});
	}

	onPageEvent(pageEvent: PageEvent) {
		this.getRoomPage({
			page: pageEvent.pageIndex,
			size: pageEvent.pageSize,
		});
		this.scrollToTopService.toTop("content", 50);
	}

	createRoom() {
		this.adminRoomService.createRoom();
	}

	editRoom(room: AdminRoom) {
		this.adminRoomService.editRoom(room);
	}

	deleteRoom(room: AdminRoom) {
		this.adminRoomService.deleteRoom(room);
	}

	openErrorMessages(errorResponse?: any) {
		this.errorLogService.openErrorMessages(errorResponse);
	}

	asRoom(value: any): AdminRoom {
		return value as AdminRoom;
	}

	trackRoom: TrackByFunction<AdminRoom> = (index: number, room: AdminRoom): string => {
		return room.id;
	};

}
