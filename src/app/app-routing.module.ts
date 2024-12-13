import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './pages/customer/customer.component';
import { HomeComponent } from './home/home.component';
import { CreateCustomerComponent } from './pages/create-customer/create-customer.component';
import { EditCustomerComponent } from './pages/edit-customer/edit-customer.component';
import { CustomerDetailsComponent } from './pages/customer-details/customer-details.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent
    // component: HomeComponent
  },
  {
    path: 'customer',
    component: CustomerComponent,
  },
  {
    path: 'create-customer',
    component: CreateCustomerComponent,
  },
  {
    path: 'edit-customer/:id',
    component: EditCustomerComponent,
  },
  {
    path: 'customer/:id',
    component: CustomerDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
