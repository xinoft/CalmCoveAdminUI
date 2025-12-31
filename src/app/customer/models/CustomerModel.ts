export class CustomerModel {
    Id: number = 0;
    FirstName: string = '';
    LastName: string = '';
    Phone: string = '';
    Email: string = '';
    Password: string | null = null;
    GoogleToken: string = '';
    AccountCreatedMode: number = 0;
    MyReferalId: string = '';
    ReferedById: string = '';
    Gender: string = '';
    PromotionMethod: number = 0;
    WalletBalance: number = 0;
    IsDeleted: boolean = false;
    IsActive: boolean = false;
    CreatedTime: string = '';
    CreatedBy: string | null = null;
    LastUpdatedTime: string = '';
    LastUpdatedBy: string | null = null;
}
