import { Component, OnInit, TrackByFunction } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { ScrollToTopService } from "../../../../core/services/scroll-to-top.service";
import { Observable } from "rxjs";
import { Page } from "../../../../core/models/page.model";
import { Sort, SortDirection } from "@angular/material/sort";
import { Pageable } from "../../../../core/services/generic-crud.service";
import { PageEvent } from "@angular/material/paginator";
import { AdminTerm } from "../state/admin-term.model";
import { AdminTermService } from "../state/admin-term.service";
import { AdminTermQuery } from "../state/admin-term.query";
import { take } from "rxjs/operators";

@Component({
	selector: "app-admin-term-list",
	templateUrl: "./admin-term-list.component.html",
	styleUrls: ["./admin-term-list.component.scss"],
})
export class AdminTermListComponent implements OnInit {

	constructor(
		private formBuilder: FormBuilder,
		private adminTermService: AdminTermService,
		private adminTermQuery: AdminTermQuery,
		private errorLogService: ErrorLogService,
		private scrollToTopService: ScrollToTopService,
	) {
	}

	title: string = "Term";
	subtitle: string = "Term List";
	termPage$!: Observable<Page<AdminTerm>>;
	sortActive: string = "";
	sortDirection: SortDirection = "asc";

	displayedColumns: string[] = ["id", "termName", "dateStart", "dateEnd", "edit", "delete"];

	ngOnInit(): void {
		const sort = this.adminTermService.pageable.sort[0].split(",");
		this.sortActive = sort[0];
		this.sortDirection = sort.length > 1 ? sort[1] as SortDirection : "asc";

		this.termPage$ = this.adminTermQuery.adminTermPage$;

		this.adminTermQuery.select(term => term.termPage).pipe(
			take(1),
		).subscribe(termPage => {
			if (termPage.empty) {
				this.getTermPage();
			}
		});
	}

	getTermPage(pageable?: Pageable) {
		this.adminTermService.getPage(pageable);
	}

	onSortChange(sort: Sort) {
		this.getTermPage({
			page: 0,
			sort: [sort.active.concat(",").concat(sort.direction)],
		});
	}

	onPageEvent(pageEvent: PageEvent) {
		this.getTermPage({
			page: pageEvent.pageIndex,
			size: pageEvent.pageSize,
		});
		this.scrollToTopService.toTop("content", 50);
	}

	createTerm() {
		this.adminTermService.createTerm();
	}

	editTerm(term: AdminTerm) {
		this.adminTermService.editTerm(term);
	}

	deleteTerm(term: AdminTerm) {
		this.adminTermService.deleteTerm(term);
	}

	openErrorMessages(errorResponse?: any) {
		this.errorLogService.openErrorMessages(errorResponse);
	}

	asTerm(value: any): AdminTerm {
		return value as AdminTerm;
	}

	trackTerm: TrackByFunction<AdminTerm> = (index: number, term: AdminTerm): string => {
		return term.id;
	};

}
