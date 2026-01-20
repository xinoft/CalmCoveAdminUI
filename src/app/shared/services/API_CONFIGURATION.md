/**
 * NOTE: Update the apiBaseUrl in dashboard.service.ts with your actual API endpoint
 * 
 * Example configurations:
 * 
 * Development:
 * private apiBaseUrl = 'http://localhost:5000/api';
 * 
 * Production:
 * private apiBaseUrl = 'https://api.yourdomain.com/api';
 * 
 * The service expects an endpoint that returns:
 * GET /Dashboard/GetDashboardData
 * 
 * Response format:
 * {
 *   "Success": true,
 *   "Error": false,
 *   "Warning": false,
 *   "SuccessMessage": null,
 *   "ErrorMessage": null,
 *   "WarningMessage": null,
 *   "Result": {
 *     "MonthlyData": {
 *       "Jan": {
 *         "PendingBookings": 1,
 *         "ConfirmedBookings": 1,
 *         "CompletedBookings": 1,
 *         "CanceledBookings": 1
 *       },
 *       "Feb": {...},
 *       ...
 *     }
 *   }
 * }
 */

// Make sure HttpClientModule is imported in your app.config.ts or app.module.ts
// Example in app.config.ts:
// import { HttpClientModule } from '@angular/common/http';
// ...
// providers: [
//   provideHttpClient(),
//   ...
// ]
