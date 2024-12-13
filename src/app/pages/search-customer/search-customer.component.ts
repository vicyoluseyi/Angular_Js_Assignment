import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface SearchCriteria {
  searchTerm: string;
  searchBy: 'name' | 'email' | 'phone';
}

@Component({
  selector: 'app-search-customer',
  templateUrl: './search-customer.component.html',
  styleUrl: './search-customer.component.css',
  standalone: false
})
export class SearchCustomerComponent {
  @Output() search = new EventEmitter<SearchCriteria>();
  
  searchControl = new FormControl('');
  searchByControl = new FormControl('name');

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.emitSearch(value || '');
    });
  }

  emitSearch(searchTerm: string) {
    this.search.emit({
      searchTerm,
      searchBy: this.searchByControl.value as 'name' | 'email' | 'phone'
    });
  }
}