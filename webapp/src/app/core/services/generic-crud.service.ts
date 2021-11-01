import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { GenericCrudService } from "./generic-crud.service.interface";
import { Observable, throwError } from "rxjs";
import { Page } from "../models/page.model";
import { Slice } from "../models/slice.model";
import { catchError } from "rxjs/operators";

interface Options {
	readOneUrl?: string,
	readAllUrl?: string,
	readPageUrl?: string,
	readSliceUrl?: string,
	createUrl?: string,
	updateUrl?: string,
	updatePartialUrl?: string,
	deleteUrl?: string,
	readOne?: boolean,
	readAll?: boolean,
	readPage?: boolean,
	readSlice?: boolean,
	create?: boolean,
	update?: boolean,
	updatePartial?: boolean,
	delete?: boolean,
}

interface LoadingUrls {
	readOneUrl: string,
	readAllUrl: string,
	readPageUrl: string,
	readSliceUrl: string,
	createUrl: string,
	updateUrl: string,
	updatePartialUrl: string,
	deleteUrl: string,
}

export abstract class AbstractGenericCrudService<T, ID> implements GenericCrudService<T, ID> {

	readonly defaultOptions: Options = {
		readOneUrl: "/:id",
		readAllUrl: "",
		readPageUrl: "/page",
		readSliceUrl: "/slice",
		createUrl: "",
		updateUrl: "/:id",
		updatePartialUrl: "/:id",
		deleteUrl: "/:id",
		readOne: true,
		readAll: true,
		readPage: true,
		readSlice: true,
		create: true,
		update: true,
		updatePartial: true,
		delete: true,
	};

	readonly options: Options;

	protected httpOptions = {
		headers: new HttpHeaders({ "Content-Type": "application/json" }),
		withCredentials: true,
	};

	protected mergePatchHttpOptions = {
		headers: new HttpHeaders({ "Content-Type": "application/merge-patch+json" }),
		withCredentials: true,
	};

	protected constructor(
		protected http: HttpClient,
		protected readonly entityUrl: string,
		options?: Options,
	) {
		this.options = { ...this.defaultOptions, ...options };
	}

	// override this method to apply custom error handler
	protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
		return throwError(errorResponse);
	}

	protected getUrlWithId(url: string, id1?: ID, id2?: ID, id3?: ID): string {
		return url
			.replace("\/:id", `/${id1}`)
			.replace("\/:id", `/${id2}`)
			.replace("\/:id", `/${id3}`);
	}

	readOne(id1: ID, id2?: ID, id3?: ID): Observable<T> {
		if (!this.options.readOne) {
			throw new Error("Unsupported Operation!");
		}
		const url = this.getUrlWithId(this.entityUrl + this.options.readOneUrl, id1, id2, id3);
		return this.http.get<T>(url, this.httpOptions).pipe(
			catchError(errorResponse => this.handleError(errorResponse)),
		);
	}

	readAll(queryParams?: HttpParams, id?: ID): Observable<Array<T>> {
		if (!this.options.readAll) {
			throw new Error("Unsupported Operation!");
		}
		const url = this.getUrlWithId(this.entityUrl + this.options.readAllUrl, id);
		return this.http
			.get<Array<T>>(url, { ...this.httpOptions, params: queryParams })
			.pipe(catchError(errorResponse => this.handleError(errorResponse)));
	}

	readPage(queryParams?: HttpParams, id?: ID): Observable<Page<T>> {
		if (!this.options.readPage) {
			throw new Error("Unsupported Operation!");
		}
		const url = this.getUrlWithId(this.entityUrl + this.options.readPageUrl, id);
		return this.http
			.get<Page<T>>(url, { ...this.httpOptions, params: queryParams })
			.pipe(catchError(errorResponse => this.handleError(errorResponse)));
	}

	readSlice(queryParams?: HttpParams, id?: ID): Observable<Slice<T>> {
		if (!this.options.readSlice) {
			throw new Error("Unsupported Operation!");
		}
		const url = this.getUrlWithId(this.entityUrl + this.options.readSliceUrl, id);
		return this.http
			.get<Slice<T>>(url, { ...this.httpOptions, params: queryParams })
			.pipe(catchError(errorResponse => this.handleError(errorResponse)));
	}

	create(payload: Partial<T>, id?: ID): Observable<T> {
		if (!this.options.create) {
			throw new Error("Unsupported Operation!");
		}
		const url = this.getUrlWithId(this.entityUrl + this.options.createUrl, id);
		return this.http
			.post<T>(url, payload, this.httpOptions)
			.pipe(catchError(errorResponse => this.handleError(errorResponse)));
	}

	update(payload: Partial<T>, id1: ID, id2?: ID, id3?: ID): Observable<T> {
		if (!this.options.update) {
			throw new Error("Unsupported Operation!");
		}
		const url = this.getUrlWithId(this.entityUrl + this.options.updateUrl, id1, id2, id3);
		return this.http
			.put<T>(url, payload, this.httpOptions)
			.pipe(catchError(errorResponse => this.handleError(errorResponse)));
	}

	updatePartial(payload: Partial<T>, id1: ID, id2?: ID, id3?: ID): Observable<T> {
		if (!this.options.updatePartial) {
			throw new Error("Unsupported Operation!");
		}
		const url = this.getUrlWithId(this.entityUrl + this.options.updatePartialUrl, id1, id2, id3);
		return this.http
			.patch<T>(url, payload, this.mergePatchHttpOptions)
			.pipe(catchError(errorResponse => this.handleError(errorResponse)));
	}

	delete(id1: ID, id2?: ID, id3?: ID): Observable<any> {
		if (!this.options.delete) {
			throw new Error("Unsupported Operation!");
		}
		const url = this.getUrlWithId(this.entityUrl + this.options.deleteUrl, id1, id2, id3);
		return this.http
			.delete(url, this.httpOptions)
			.pipe(catchError(errorResponse => this.handleError(errorResponse)));
	}
}
