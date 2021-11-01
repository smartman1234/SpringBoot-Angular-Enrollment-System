import { AfterContentChecked, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { FormBuilder, FormControl, Validators } from "@angular/forms";

@Component({
	selector: "app-paginator",
	templateUrl: "./paginator.component.html",
	styleUrls: ["./paginator.component.scss"],
})
export class PaginatorComponent implements OnInit, AfterContentChecked {

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@Input() pageSize: number = 20;
	@Input() length: number = 0;
	@Input() pageIndex: number = 0;
	@Input() pageSizeOptions: number[] = [];
	@Input() showFirstLastButtons: boolean = false;
	@Input() hidePageSize: boolean = false;
	@Input() disabled: boolean = false;
	@Input() color: ThemePalette;

	@Output() page = new EventEmitter<PageEvent>();

	goToPage() {
		if (this.pageNumber.value - 1 === this.paginator.pageIndex) {
			return;
		}
		this.paginator.pageIndex = this.pageNumber.value - 1;
		const event: PageEvent = {
			length: this.paginator.length,
			pageIndex: this.paginator.pageIndex,
			pageSize: this.paginator.pageSize,
		};
		this.paginator.page.next(event);
		this.onPageEvent(event);
	}

	onPageEvent(pageEvent: PageEvent) {
		this.pageNumber.setValue(pageEvent.pageIndex + 1);
		this.maxPageNumber = Math.ceil(this.length / this.pageSize);
		this.page.emit(pageEvent);
	}

	pageNumberForm = this.formBuilder.group({
		pageNumber: [1, { validators: [Validators.required] }],
	});

	maxPageNumber: number = 1;

	get pageNumber() {
		return this.pageNumberForm.get("pageNumber") as FormControl;
	}

	constructor(
		private formBuilder: FormBuilder,
	) {
	}

	ngAfterContentChecked(): void {
		this.maxPageNumber = Math.ceil(this.length / this.pageSize);
	}

	ngOnInit(): void {
	}

}
