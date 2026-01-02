export class BookingModel {
    Id: number = 0;
    Massage: any = null;
    CustomerAccount: any = null;
    Assignee: any = null;
    BookingTransaction: any = null;
    IntialSlotTime: string = '';
    FinalSlotTime: string = '';
    Status: number = 0; // 0 - Pending, 1 - Confirmed, 2 - Success
    Notes: string = '';
    IsDeleted: boolean = false;
    IsActive: boolean = false;
    CreatedTime: string = '';
    CreatedBy: string | null = null;
    LastUpdatedTime: string = '';
    LastUpdatedBy: string | null = null;
}
