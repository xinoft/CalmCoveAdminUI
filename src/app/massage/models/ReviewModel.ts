export class ReviewModel {
  Id: number = 0;
  Massage: any;
  Booking: any;
  Star: number = 0;
  Comment: string = '';
  ApprovalStatus: number = 0; // 0: Pending, 1: Approved, 2: Declined
  IsDeleted: boolean = false;
  IsActive: boolean = true;
  CreatedTime: Date = new Date();
  CreatedBy: string | null = null;
  LastUpdatedTime: Date = new Date();
  LastUpdatedBy: string | null = null;
}
