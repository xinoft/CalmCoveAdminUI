export interface MonthlyBookingData {
  PendingBookings: number;
  ConfirmedBookings: number;
  CompletedBookings: number;
  CanceledBookings: number;
}

export interface RevenueData {
  PaidAmount: number;
  DeliveryAmount: number;
  DiscountAmount: number;
  WalletAmountUsed: number;
}

export interface MonthlyData {
  [month: string]: MonthlyBookingData;
}

export interface DashboardDataResult {
  MonthlyData: MonthlyData;
  MostCustomerName: string;
  MostMassageName: string;
  MostAssignedTherapist: string;
  CurrentMonthRevenue: RevenueData;
  YearlyRevenue: RevenueData;
}

export interface DashboardApiResponse {
  Success: boolean;
  Error: boolean;
  Warning: boolean;
  SuccessMessage: string | null;
  ErrorMessage: string | null;
  WarningMessage: string | null;
  Result: DashboardDataResult;
}
