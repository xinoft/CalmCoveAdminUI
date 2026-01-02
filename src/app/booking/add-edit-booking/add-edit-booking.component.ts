import { Component, Input, OnInit } from '@angular/core';
import { BookingModel } from '../models/BookingModel';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorComponent } from '../../shared/components/form-error/form-error.component';
import { BookingService } from '../booking.service';
import { ToastMessage, ToastType } from '../../shared/models/ToastMessage';
import { UtilityService } from '../../shared/services/utility.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { UserAccount } from '../../user-account/models/UserAccount';

@Component({
  selector: 'app-add-edit-booking',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FormErrorComponent, CommonModule, DropdownModule],
  templateUrl: './add-edit-booking.component.html',
  styleUrl: './add-edit-booking.component.css'
})
export class AddEditBookingComponent implements OnInit {

  bookingForm: any;
  @Input() refreshBookingList: any;
  @Input() bookingId?: number;

  usersList: UserAccount[] = [];

  statusOptions = [
    { value: 0, label: 'Pending' },
    { value: 1, label: 'Confirmed' },
    { value: 2, label: 'Success' }
  ];

  constructor(private _bookingService: BookingService, private _utilityService: UtilityService) {
    this.initBookingFormGroup(new BookingModel());
  }

  ngOnInit() {

  }

  setUsersList(users: UserAccount[]) {
    this.usersList = users;
  }

  initBookingFormGroup(booking: BookingModel) {
    this.bookingForm = new FormGroup({
      bookingId: new FormControl(booking.Id),
      massageName: new FormControl({ value: booking.Massage?.Name || '', disabled: true }),
      customerName: new FormControl({ value: this.getCustomerName(booking.CustomerAccount), disabled: true }),
      customerPhone: new FormControl({ value: booking.CustomerAccount?.Phone || '', disabled: true }),
      customerEmail: new FormControl({ value: booking.CustomerAccount?.Email || '', disabled: true }),
      bookingAmount: new FormControl({ value: booking.BookingTransaction?.BookingAmount || 0, disabled: true }),
      deliveryAmount: new FormControl({ value: booking.BookingTransaction?.DeliveryAmount || 0, disabled: true }),
      discountAmount: new FormControl({ value: booking.BookingTransaction?.PromotionDiscountAmount || 0, disabled: true }),
      totalAmount: new FormControl({ value: booking.BookingTransaction?.TotalAmount || 0, disabled: true }),
      initialSlotTime: new FormControl({ value: this.formatDateTime(booking.IntialSlotTime), disabled: true }),
      finalSlotTime: new FormControl(this.formatDateTime(booking.FinalSlotTime), Validators.required),
      assignee: new FormControl(booking.Assignee ? this.getUserFromId(booking.Assignee?.Id) : null, Validators.required),
      status: new FormControl(booking.Status, Validators.required),
      notes: new FormControl({ value: booking.Notes || '', disabled: true })
    });
  }

  getUserFromId(userId: number): UserAccount | null {
    return this.usersList.find(u => u.Id === userId) || null;
  }

  getCustomerName(customer: any): string {
    if (!customer) return '';
    return customer.FirstName + ' ' + customer.LastName;
  }

  formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onSubmitBookingForm() {
    if (this.bookingForm.valid) {
      const assigneeUser = this.bookingForm.get('assignee')?.value;
      const bookingData = {
        bookingId: this.bookingForm.get('bookingId')?.value,
        finalSlotTime: this.bookingForm.get('finalSlotTime')?.value,
        assignee: assigneeUser?.Id || assigneeUser?.id || '',
        status: this.bookingForm.get('status')?.value
      };
      this._bookingService.updateBooking(bookingData).subscribe({
        next: (response) => {
          if (response.Success) {
            this.onSuccessfulSave(response);
          } else {
            this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, 'Booking'));
          }
        },
        error: (error) => {
          console.error('Error saving booking:', error);
          this._utilityService.showToast(new ToastMessage(ToastType.Error, 'Error updating booking', 'Booking'));
        }
      });
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }

  onSuccessfulSave(response: any) {
    if (this.refreshBookingList) {
      this.refreshBookingList();
    }
    this._utilityService.showModal(false, 'booking-add-edit');
    this._utilityService.showToast(new ToastMessage(ToastType.Success, response.SuccessMessage, 'Booking'));
  }

  compareUsers(user1: UserAccount, user2: UserAccount): boolean {
    return user1 && user2 ? user1.Id === user2.Id : user1 === user2;
  }
}
