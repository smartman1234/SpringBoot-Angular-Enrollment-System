import { Observable } from "rxjs";
import { Page } from "../models/page.model";
import { Slice } from "../models/slice.model";
import { HttpParams } from "@angular/common/http";

export interface GenericCrudService<T, ID> {
	create(payload: Partial<T>, id?: ID): Observable<T>;
	update(payload: Partial<T>, id1: ID, id2?: ID, id3?: ID): Observable<T>;
	updatePartial(payload: Partial<T>, id1: ID, id2?: ID, id3?: ID): Observable<T>;
	readOne(id1: ID, id2?: ID, id3?: ID): Observable<T>;
	readAll(queryParams?: HttpParams, id?: ID): Observable<Array<T>>;
	readPage(queryParams?: HttpParams, id?: ID): Observable<Page<T>>;
	readSlice(queryParams?: HttpParams, id?: ID): Observable<Slice<T>>;
	delete(id1: ID, id2?: ID, id3?: ID): Observable<any>;
}
