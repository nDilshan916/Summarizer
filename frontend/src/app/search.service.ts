import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchBarVisible = new BehaviorSubject<boolean>(false);
  searchBarVisibility$ = this.searchBarVisible.asObservable();

  showSearchBar() {
    this.searchBarVisible.next(true);
  }

  hideSearchBar() {
    this.searchBarVisible.next(false);
  }
}
