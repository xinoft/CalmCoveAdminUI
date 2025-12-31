import { Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CustomerService } from '../customer.service';
import { UtilityService } from '../../shared/services/utility.service';
import { ApiResponse } from '../../shared/models/ApiResponse';
import { ToastMessage, ToastType } from '../../shared/models/ToastMessage';
import { FormsModule } from '@angular/forms';
import { CustomerModel } from '../models/CustomerModel';
import { CommonModule } from '@angular/common';
import { PricePipe } from "../../shared/pipes/price.pipe";

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [TableModule, FormsModule, CommonModule, PricePipe],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {

  customerList: CustomerModel[] = [];
  selectedCustomer: CustomerModel = new CustomerModel();
  searchKeyword = '';

  constructor(
    private _customerService: CustomerService,
    private _utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.getCustomerList();
  }

  clearCustomerListFilter() {
    this.searchKeyword = '';
    this.getCustomerList();
  }

  getCustomerList() {
    this._utilityService.showLoader(true);
    this._customerService.getCustomerList(this.searchKeyword).subscribe(
      (response: ApiResponse<CustomerModel[]>) => {
        if (response.Success) {
          this.customerList = response.Result;
        }
        this._utilityService.showLoader(false);
      }
    );
  }

  removeCustomer(id: number) {
    if (!window.confirm('Are you sure you want to remove this Customer')) {
      return;
    }
    this._utilityService.showLoader(true);
    this._customerService.removeCustomer(id).subscribe((response: ApiResponse<null>) => {
      if (response.Success) {
        this._utilityService.showToast(new ToastMessage(ToastType.Success, response.SuccessMessage, 'Customer'));
        this.getCustomerList();
      } else {
        this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, 'Customer'));
      }
      this._utilityService.showLoader(false);
    });
  }

  toggleCustomerStatus(id: number, currentStatus: boolean) {
    const newStatus = !currentStatus;
    const statusText = newStatus ? 'Activate' : 'Deactivate';
    if (!window.confirm(`Are you sure you want to ${statusText} this Customer?`)) {
      return;
    }
    this._utilityService.showLoader(true);
    this._customerService.setCustomerActiveStatus(id, newStatus).subscribe((response: ApiResponse<null>) => {
      if (response.Success) {
        this._utilityService.showToast(new ToastMessage(ToastType.Success, response.SuccessMessage, 'Customer Status'));
        this.getCustomerList();
      } else {
        this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, 'Customer Status'));
      }
      this._utilityService.showLoader(false);
    });
  }
}
