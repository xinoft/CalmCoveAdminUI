import { Component, Input, OnInit } from '@angular/core';
import { BookingModel } from '../models/BookingModel';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorComponent } from '../../shared/components/form-error/form-error.component';
import { BookingService } from '../booking.service';
import { ToastMessage, ToastType } from '../../shared/models/ToastMessage';
import { UtilityService } from '../../shared/services/utility.service';
import { TimezoneService } from '../../shared/services/timezone.service';
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
    isFormReadonly = false;

    usersList: UserAccount[] = [];

    statusOptions = [
        { value: 0, label: 'Pending' },
        { value: 1, label: 'Confirmed' },
        { value: 2, label: 'Completed' },
        { value: 3, label: 'Cancelled' }
    ];

    constructor(private _bookingService: BookingService, private _utilityService: UtilityService, private _timezoneService: TimezoneService) {
        this.initBookingFormGroup(new BookingModel());
    }

    ngOnInit() {
        // Subscribe to status changes to trigger change detection and disable form
        this.bookingForm.get('status')?.valueChanges.subscribe((value: number) => {
            this.updateFormReadonlyState(value);
        });
        // Set initial readonly state based on current status
        this.updateFormReadonlyState(this.bookingForm.get('status')?.value);
    }

    updateFormReadonlyState(status: number) {
        const isReadonly = status === 2 || status === 3;
        this.isFormReadonly = isReadonly;
        const controlsToToggle = ['finalSlotTime', 'assignee', 'status', 'notes'];
        
        controlsToToggle.forEach(controlName => {
            const control = this.bookingForm.get(controlName);
            if (control) {
                if (isReadonly) {
                    control.disable({ emitEvent: false });
                } else {
                    control.enable({ emitEvent: false });
                }
            }
        });
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
            paidAmount: new FormControl({ value: booking.BookingTransaction?.PaidAmount || 0, disabled: true }),
            walletAmount: new FormControl({ value: booking.BookingTransaction?.WalletAmount || 0, disabled: true }),
            initialSlotTime: new FormControl({ value: this.formatDateTime(booking.IntialSlotTime), disabled: true }),
            finalSlotTime: new FormControl(this.formatDateTime(booking.FinalSlotTime), Validators.required),
            assignee: new FormControl(booking.Assignee ? booking.Assignee.Id : null, Validators.required),
            status: new FormControl(booking.Status, Validators.required),
            notes: new FormControl({ value: booking.Notes || '', disabled: false }),
            address:new FormControl({ value: booking.BookingTransaction?.Address?.Name + ', ' 
                + booking.BookingTransaction?.Address?.Line1 + ', ' 
                + booking.BookingTransaction?.Address?.Line3 + ', ' 
                + booking.BookingTransaction?.Address?.GooglePlace
                 || '', disabled: true }),
        });
        // Update readonly state after form is initialized
        this.updateFormReadonlyState(booking.Status);
        // Subscribe to status changes for this form instance
        this.bookingForm.get('status')?.valueChanges.subscribe((value: number) => {
            this.updateFormReadonlyState(value);
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
        try {
            const localDate = this._timezoneService.utcToLocal(dateTimeString);
            const year = localDate.getFullYear();
            const month = String(localDate.getMonth() + 1).padStart(2, '0');
            const day = String(localDate.getDate()).padStart(2, '0');
            const hours = String(localDate.getHours()).padStart(2, '0');
            const minutes = String(localDate.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    }

    onSubmitBookingForm() {
        if (this.bookingForm.valid) {
            debugger
            const assigneeUser = this.bookingForm.get('assignee')?.value;
            const finalSlotTimeLocal = this.bookingForm.get('finalSlotTime')?.value;

            const bookingData = {
                bookingId: this.bookingForm.get('bookingId')?.value,
                finalSlotTime: this._timezoneService.convertLocalInputToUtc(finalSlotTimeLocal),
                assignee: assigneeUser ? assigneeUser : 0,
                status: this.bookingForm.get('status')?.value,
                notes: this.bookingForm.get('notes')?.value || ''
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

    getFilteredStatusOptions() {
        const currentStatus = this.bookingForm.get('status')?.value;
        // Hide Pending option (value 0) when status is 1 (Confirmed)
        if (currentStatus === 1) {
            return this.statusOptions.filter(option => option.value !== 0);
        }
        // Hide Pending and Confirmed options (value 0 and 1) when status is 2 (Completed)
        if (currentStatus === 2) {
            return this.statusOptions.filter(option => option.value !== 0 && option.value !== 1);
        }
        return this.statusOptions;
    }

    isStatusReadonly(): boolean {
        const currentStatus = this.bookingForm.get('status')?.value;
        // Make status readonly when it's 2 (Completed) or 3 (Cancelled)
        return currentStatus === 2 || currentStatus === 3;
    }
}
