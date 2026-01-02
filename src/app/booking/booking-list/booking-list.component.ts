import { Component, OnInit, ViewChild } from '@angular/core';
import { BookingService } from '../booking.service';
import { UtilityService } from '../../shared/services/utility.service';
import { BookingModel } from '../models/BookingModel';
import { ApiResponse } from '../../shared/models/ApiResponse';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { PricePipe } from '../../shared/pipes/price.pipe';
import { CommonModule } from '@angular/common';
import { ToastMessage, ToastType } from '../../shared/models/ToastMessage';
import { AddEditBookingComponent } from '../add-edit-booking/add-edit-booking.component';
import { UserAccountService } from '../../user-account/services/user-account.service';
import { UserAccount } from '../../user-account/models/UserAccount';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [TableModule, FormsModule, PricePipe, CommonModule, AddEditBookingComponent],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.css'
})
export class BookingListComponent implements OnInit {

  @ViewChild('bookingAddEdit') bookingAddEditComponent: AddEditBookingComponent | null = null;

  bookingList: BookingModel[] = [];
  usersList: UserAccount[] = [];
  selectedBooking: BookingModel = new BookingModel();
  searchKeyword = '';
  selectedStatus: any = null;
  selectedOrderBy = 'BookingDate';

  statusOptions = [
    { value: null, label: 'All' },
    { value: 0, label: 'Pending' },
    { value: 1, label: 'Confirmed' },
    { value: 2, label: 'Completed' },
    { value: 3, label: 'Canceled' }
  ];

  orderByOptions = [
    { value: 'BookingDate', label: 'Booking Date' },
    { value: 'OrderDate', label: 'Order Date' }
  ];

  constructor(
    private _bookingService: BookingService,
    private _userAccountService: UserAccountService,
    private _utilityService: UtilityService
  ) {
    this.getBookingList();
    this.getUsersList();
  }

  ngOnInit(): void {
  }

  getUsersList() {
    this._userAccountService.getUserAccountList('', '', '').subscribe(
      (response: ApiResponse<UserAccount[]>) => {
        if (response.Success) {
          this.usersList = response.Result;
        }
      }
    );
  }

  clearBookingListFilter() {
    this.searchKeyword = '';
    this.selectedStatus = null;
    this.selectedOrderBy = 'BookingDate';
    this.getBookingList();
  }

  getBookingList() {
    this._utilityService.showLoader(true);
    this._bookingService.getBookingList(this.searchKeyword, this.selectedStatus, this.selectedOrderBy).subscribe(
      (response: ApiResponse<BookingModel[]>) => {
        if (response.Success) {
          this.bookingList = response.Result;
        }
        this._utilityService.showLoader(false);
      },
      (error) => {
        this._utilityService.showToast(new ToastMessage(ToastType.Error, 'Error loading bookings', 'Booking'));
        this._utilityService.showLoader(false);
      }
    );
  }

  get getBookingListFromChild() {
    return this.getBookingList.bind(this);
  }

  viewEditBooking(id: number) {
    this._utilityService.showLoader(true);
    this._bookingService.getBookingById(id).subscribe((response: ApiResponse<BookingModel>) => {
      if (response.Success) {
        this.selectedBooking = response.Result;
        this.bookingAddEditComponent?.initBookingFormGroup(this.selectedBooking);
        this.bookingAddEditComponent?.setUsersList(this.usersList);
      }
      this._utilityService.showLoader(false);
      this._utilityService.showModal(true, 'booking-add-edit');
    });
  }

  getStatusLabel(status: number): string {
    const statusOption = this.statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.label : 'Unknown';
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 0:
        return 'bg-warning';
      case 1:
        return 'bg-info';
      case 2:
        return 'bg-success';
      case 3:
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
