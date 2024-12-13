import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICustomer } from '../../interfaces/customer';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css',
  standalone: false
})
export class CustomerDetailsComponent implements OnInit {
  customer: ICustomer | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCustomerDetails(id);
  }

  loadCustomerDetails(id: number): void {
    this.customerService.getCustomerById(id).subscribe({
      next: (customer) => {
        this.customer = customer;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        this.snackBar.open('Error loading customer details', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  onEdit(): void {
    if (this.customer) {
      this.router.navigate(['/edit-customer', this.customer.id]);
    }
  }

  onDelete(): void {
    if (!this.customer) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete customer "${this.customer.name}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.deleteCustomer(this.customer!.id).subscribe({
          next: () => {
            this.snackBar.open('Customer deleted successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            this.router.navigate(['/customer']);
          },
          error: (error) => {
            this.snackBar.open('Error deleting customer: ' + error.message, 'Close', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          }
        });
      }
    });
  }
}
