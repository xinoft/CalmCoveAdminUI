import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from '../shared/services/shared.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../shared/models/ApiResponse';
import { BookingModel } from './models/BookingModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private _http: HttpClient, private _sharedService: SharedService) { }

  getBookingList(searchKeyword: string, status: any, orderBy: string): Observable<any> {
    const payload = {
      updatedById: 0,
      searchKeyword: searchKeyword,
      status: status,
      orderBy: orderBy
    };
    return this._http.post<ApiResponse<BookingModel[]>>(`${environment.baseUrl}Booking/GetBookingList`, payload);
  }

  getBookingById(id: number): Observable<any> {
    return this._http.get<ApiResponse<BookingModel>>(`${environment.baseUrl}Booking/GetBooking?bookingId=${id}`);
  }

  updateBooking(data: any): Observable<any> {
    return this._http.post<any>(`${environment.baseUrl}Booking/UpdateBooking`, data);
  }
}
