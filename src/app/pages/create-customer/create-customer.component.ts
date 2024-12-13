import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICustomer } from '../../interfaces/customer';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CreateCustomerComponent implements OnInit {
  customerFormGroup!: FormGroup;
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.createCustomerForm();
  }

  createCustomerForm() {
    this.customerFormGroup = this.formBuilder.group({
      personal: this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]+$/)]],
        website: ['', [Validators.pattern(/^https?:\/\/.+$/)]],
      }),
      company: this.formBuilder.group({
        name: ['', Validators.required],
        catchPhrase: [''],
        bs: ['']
      }),
      address: this.formBuilder.group({
        street: ['', Validators.required],
        suite: [''],
        city: ['', Validators.required],
        zipcode: ['', Validators.required],
        geo: this.formBuilder.group({
          lat: [''],
          lng: ['']
        })
      })
    });
  }

  // Helper method to check if a field has errors
  hasError(controlPath: string, errorName: string): boolean {
    const control = this.customerFormGroup.get(controlPath);
    return control?.touched && control?.hasError(errorName) || false;
  }

  // Helper method to get nested form control
  getControl(controlPath: string): AbstractControl | null {
    return this.customerFormGroup.get(controlPath);
  }

  onSubmit() {
    if (this.customerFormGroup.invalid) {
      this.markFormGroupTouched(this.customerFormGroup);
      return;
    }

    this.isSubmitting = true;
    const customerData: ICustomer = this.customerFormGroup.value;

    this.customerService.createCustomer(customerData).subscribe({
      next: () => {
        this.snackBar.open('Customer created successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.router.navigate(['/customer']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.snackBar.open('Error creating customer: ' + error.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
