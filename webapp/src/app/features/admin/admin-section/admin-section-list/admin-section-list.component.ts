import { Component, OnInit, TrackByFunction } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { ScrollToTopService } from "../../../../core/services/scroll-to-top.service";
import { Observable } from "rxjs";
import { Page } from "../../../../core/models/page.model";
import { Sort, SortDirection } from "@angular/material/sort";
import { filter, takeUntil } from "rxjs/operators";
import { Pageable } from "../../../../core/services/generic-crud.service";
import { PageEvent } from "@angular/material/paginator";
import { UnsubscribeComponent } from "../../../../core/components/unsubscribe/unsubscribe.component";
import { AdminSectionService } from "../state/admin-section.service";
import { AdminSectionQuery } from "../state/admin-section.query";
import { AdminSection } from "../state/admin-section.model";
import { AdminTermService } from "../../admin-term/state/admin-term.service";
import { AdminTermQuery } from "../../admin-term/state/admin-term.query";
import { AdminTermStore } from "../../admin-term/state/admin-term.store";
import { AdminSubjectService } from "../../admin-subject/state/admin-subject.service";
import { AdminSubjectQuery } from "../../admin-subject/state/admin-subject.query";
import { AdminSubjectStore } from "../../admin-subject/state/admin-subject.store";
import { AdminTerm } from "../../admin-term/state/admin-term.model";
import { AdminSubject } from "../../admin-subject/state/admin-subject.model";
import { combineQueries } from "@datorama/akita";

@Component({
	selector: "app-admin-section-list",
	templateUrl: "./admin-section-list.component.html",
	styleUrls: ["./admin-section-list.component.scss"],
})
export class AdminSectionListComponent extends UnsubscribeComponent implements OnInit {

	constructor(
		private formBuilder: FormBuilder,
		private adminSectionService: AdminSectionService,
		private adminSectionQuery: AdminSectionQuery,
		private adminTermService: AdminTermService,
		private adminTermQuery: AdminTermQuery,
		private adminTermStore: AdminTermStore,
		private adminSubjectService: AdminSubjectService,
		private adminSubjectQuery: AdminSubjectQuery,
		private adminSubjectStore: AdminSubjectStore,
		private errorLogService: ErrorLogService,
		private scrollToTopService: ScrollToTopService,
	) {
		super();
	}

	title: string = "Section";
	subtitle: string = "Section List";
	terms$!: Observable<AdminTerm[]>;
	subjects$!: Observable<AdminSubject[]>;
	sectionPage$!: Observable<Page<AdminSection>>;
	sortActive: string = "";
	sortDirection: SortDirection = "asc";
	breakPoint: number = 1000;
	showScrollToTop: boolean = false;

	displayedColumns: string[] = ["id", "course", "sectionNumber", "meetingDays", "meetingTimeStart", "meetingTimeEnd",
		"classCapacity", "waitlistCapacity", "enrolledNumber", "waitingNumber", "dateStart", "dateEnd",
		"sectionStatus", "room", "instructor", "termName",
		"termId", "courseId", "roomId", "instructorId", "edit", "delete"];

	filterForm = this.formBuilder.group({
		term: ["", { validators: [Validators.required] }],
		subject: ["", { validators: [Validators.required] }],
	});

	get term() {
		return this.filterForm.get("term") as FormControl;
	}

	get subject() {
		return this.filterForm.get("subject") as FormControl;
	}

	ngOnInit(): void {
		const sort = this.adminSectionService.pageable.sort[0].split(",");
		this.sortActive = sort[0];
		this.sortDirection = sort.length > 1 ? sort[1] as SortDirection : "asc";

		this.sectionPage$ = this.adminSectionQuery.adminSectionPage$;
		this.terms$ = this.adminTermQuery.adminTerms$;
		this.subjects$ = this.adminSubjectQuery.adminSubjects$;

		this.adminTermService.getAll().subscribe();
		this.adminSubjectService.getAll().subscribe();
		combineQueries([
			this.adminTermQuery.selectAll().pipe(filter(terms => terms.length > 0)),
			this.adminTermQuery.selectActive(),
			this.adminSubjectQuery.selectAll().pipe(filter(subjects => subjects.length > 0)),
		]).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(([terms, activeTerm, subjects]) => {
			this.unsubscribe$.next();
			this.unsubscribe$.complete();
			if (activeTerm) {
				this.term.setValue(activeTerm);
			} else {
				this.term.setValue(terms[0]);
			}

			this.subject.setValue(subjects[0]);
			this.getSectionPage();
		});
	}

	onScroll(event: any) {
		const scrollValue = event.target.offsetHeight + event.target.scrollTop;
		if (!this.showScrollToTop && scrollValue >= this.breakPoint) {
			this.showScrollToTop = true;
		}
		if (this.showScrollToTop && scrollValue < this.breakPoint) {
			this.showScrollToTop = false;
		}
	}

	scrollToTop() {
		this.scrollToTopService.scrollToTop("admin-table-container");
	}

	getSectionPage(pageable?: Pageable) {
		if (this.term.value && this.subject.value) {
			this.adminTermStore.setActive(this.term.value.id);
			this.adminSectionService.getPage(this.term.value.termName, this.subject.value.subjectAcronym, pageable);
		}
	}

	onSortChange(sort: Sort) {
		this.getSectionPage({
			page: 0,
			sort: [sort.active.concat(",").concat(sort.direction)],
		});
	}

	onPageEvent(pageEvent: PageEvent) {
		this.getSectionPage({
			page: pageEvent.pageIndex,
			size: pageEvent.pageSize,
		});
	}

	createSection() {
		this.adminSectionService.createSection();
	}

	editSection(section: AdminSection) {
		this.adminSectionService.editSection(section);
	}

	deleteSection(section: AdminSection) {
		this.adminSectionService.deleteSection(section);
	}

	openErrorMessages(errorResponse?: any) {
		this.errorLogService.openErrorMessages(errorResponse);
	}

	asSection(value: any): AdminSection {
		return value as AdminSection;
	}

	trackSection: TrackByFunction<AdminSection> = (index: number, section: AdminSection): string => {
		return section.id;
	};

}
