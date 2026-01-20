export interface MonthlyBookingData {
  PendingBookings: number;
  ConfirmedBookings: number;
  CompletedBookings: number;
  CanceledBookings: number;
}

export interface MonthlyData {
  [month: string]: MonthlyBookingData;
}

export interface DashboardDataResult {
  MonthlyData: MonthlyData;
  MostCustomerName: string;
  MostMassageName: string;
  MostAssignedTherapist: string;
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
