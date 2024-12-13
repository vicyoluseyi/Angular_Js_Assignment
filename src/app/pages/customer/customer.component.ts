import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { ICustomer, ICustomers } from '../../interfaces/customer';
import { Router } from '@angular/router';
import { SearchCriteria } from '../search-customer/search-customer.component';

export interface Customer {
  position: number;
  name: string;
  phone: string;
  email: string;
  gender: string;
}

@Component({
  selector: 'app-customer',
  standalone: false,
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class 
CustomerComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'phone', 'email', 'gender'];
  dataSource!: ICustomers;
  formGroup!: FormGroup;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.onGetCustomers();
  }

  onGetCustomers() {
    this.customerService.getCustomers().subscribe((customers: ICustomer[]) => {
      this.dataSource = customers;
    });
  }

  onCustomerClick(customer: ICustomer) {
    this.router.navigate(['/customer', customer.id]);
  }

  onSearch(criteria: SearchCriteria) {
    this.customerService.searchCustomers(criteria).subscribe((customers: ICustomer[]) => {
      this.dataSource = customers;
    });
  }
}
