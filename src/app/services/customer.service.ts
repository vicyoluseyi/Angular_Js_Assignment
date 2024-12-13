import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICustomer } from '../interfaces/customer';
import { map } from 'rxjs/operators';
import { SearchCriteria } from '../pages/search-customer/search-customer.component';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<ICustomer[]> {
    return this.http.get<ICustomer[]>('https://jsonplaceholder.typicode.com/users');
  }

  createCustomer(customer: ICustomer): Observable<ICustomer> {
    return this.http.post<ICustomer>('https://jsonplaceholder.typicode.com/users', customer);
  }

  editCustomer(customer: ICustomer): Observable<ICustomer> {
    return this.http.put<ICustomer>(`https://jsonplaceholder.typicode.com/users/${customer.id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`https://jsonplaceholder.typicode.com/users/${id}`);
  }

  getCustomerById(id: number): Observable<ICustomer> {
    return this.http.get<ICustomer>(`https://jsonplaceholder.typicode.com/users/${id}`);
  }

  searchCustomers(criteria: SearchCriteria): Observable<ICustomer[]> {
    return this.getCustomers().pipe(
      map(customers => customers.filter(customer => {
        const searchTerm = criteria.searchTerm.toLowerCase();
        const value = customer[criteria.searchBy as keyof ICustomer];

        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm);
        }
        return false;
      }))
    );
  }
}
