import { Component, Input, OnInit } from '@angular/core';
import { CustomerModel } from '../models/CustomerModel';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorComponent } from '../../shared/components/form-error/form-error.component';
import { CustomerService } from '../customer.service';
import { ToastMessage, ToastType } from '../../shared/models/ToastMessage';
import { UtilityService } from '../../shared/services/utility.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-edit-customer',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FormErrorComponent, CommonModule],
  templateUrl: './add-edit-customer.component.html',
  styleUrl: './add-edit-customer.component.css'
})
export class AddEditCustomerComponent implements OnInit {

  customerForm: any;
  @Input() customerModeText = '';
  @Input() refreshCustomerList: any;
  @Input() customerId?: number;

  genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ];

  promotionMethodOptions = [
    { value: 1, label: 'None' },
    { value: 2, label: 'Email' }
  ];

  constructor(private _customerService: CustomerService, private _utilityService: UtilityService) {
    this.initCustomerFormGroup(new CustomerModel());
  }

  ngOnInit() {

  }

  initCustomerFormGroup(customer: CustomerModel) {
    this.customerForm = new FormGroup({
      customerId: new FormControl(customer.Id),
      firstName: new FormControl(customer.FirstName, Validators.required),
      lastName: new FormControl(customer.LastName, Validators.required),
      email: new FormControl(customer.Email, [Validators.required, Validators.email]),
      phone: new FormControl(customer.Phone, Validators.required),
      gender: new FormControl(customer.Gender || ''),
      promotionMethod: new FormControl(customer.PromotionMethod || 1, Validators.required),
      googleToken: new FormControl(customer.GoogleToken || 'empty')
    });
  }

  onSubmitCustomerForm() {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;
      this._customerService.updateCustomer(customerData).subscribe({
        next: (response) => {
          if (response.Success) {
            this.onSuccessfulSave(response);
          } else {
            this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, 'Customer'));
          }
        },
        error: (error) => {
          console.error('Error saving customer:', error);
          this._utilityService.showToast(new ToastMessage(ToastType.Error, 'Error saving customer', 'Customer'));
        }
      });
    } else {
      this.customerForm.markAllAsTouched();
    }
  }

  onSuccessfulSave(response: any) {
    this.customerForm.reset();
    this.initCustomerFormGroup(new CustomerModel());
    if (this.refreshCustomerList) {
      this.refreshCustomerList();
    }
    this._utilityService.showModal(false, 'customer-add-edit');
    this._utilityService.showToast(new ToastMessage(ToastType.Success, response.SuccessMessage, 'Customer'));
  }
}
