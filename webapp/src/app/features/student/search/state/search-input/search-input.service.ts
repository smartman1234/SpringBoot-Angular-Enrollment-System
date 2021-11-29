import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SearchInputStore } from './search-input.store';

@Injectable({ providedIn: 'root' })
export class SearchInputService {

  constructor(private searchInputStore: SearchInputStore, private http: HttpClient) {
  }


}
