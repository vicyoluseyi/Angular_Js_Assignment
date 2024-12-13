import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICustomer } from '../../interfaces/customer';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css',
  standalone: false
})
export class EditCustomerComponent implements OnInit {
  customerFormGroup!: FormGroup;
  isSubmitting = false;
  customerId!: number;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.createCustomerForm();
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCustomerData();
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

  loadCustomerData() {
    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (customer: ICustomer) => {
        // Transform the flat customer object to match form structure
        const formData = {
          personal: {
            name: customer.name,
            username: customer.username,
            email: customer.email,
            phone: customer.phone,
            website: customer.website
          },
          company: customer.company,
          address: customer.address
        };
        this.customerFormGroup.patchValue(formData);
      },
      error: (error: any) => {
        this.snackBar.open('Error loading customer: ' + error.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.router.navigate(['/customer']);
      }
    });
  }

  hasError(controlPath: string, errorName: string): boolean {
    const control = this.customerFormGroup.get(controlPath);
    return control?.touched && control?.hasError(errorName) || false;
  }

  getControl(controlPath: string): AbstractControl | null {
    return this.customerFormGroup.get(controlPath);
  }

  onSubmit() {
    if (this.customerFormGroup.invalid) {
      this.markFormGroupTouched(this.customerFormGroup);
      return;
    }

    this.isSubmitting = true;
    const formData = this.customerFormGroup.value;

    // Transform the nested form data back to flat structure
    const customerData: ICustomer = {
      id: this.customerId,
      ...formData.personal,
      company: formData.company,
      address: formData.address
    };

    this.customerService.editCustomer(customerData).subscribe({
      next: () => {
        this.snackBar.open('Customer updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.router.navigate(['/customer']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.snackBar.open('Error updating customer: ' + error.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
