import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from '../shared/services/shared.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../shared/models/ApiResponse';
import { environment } from '../../environments/environment';
import { CustomerModel } from './models/CustomerModel';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private _http: HttpClient, private _sharedService: SharedService) { }

  getCustomerList(searchKeyword: string): Observable<any> {
    var params = new HttpParams()
      .append('SearchKeyword', searchKeyword);
    return this._http.get<ApiResponse<CustomerModel[]>>(`${environment.baseUrl}Customer/GetCusomerList`, { params: params });
  }

  getCustomer(id: number): Observable<any> {
    var params = new HttpParams().append('id', id);
    return this._http.get<ApiResponse<CustomerModel>>(`${environment.baseUrl}Customer/GetCustomerById`, { params: params });
  }

  removeCustomer(customerId: any): Observable<any> {
    let formData = new FormData()
    formData.append('customerId', customerId);
    return this._http.post<any>(`${environment.baseUrl}Customer/RemoveCustomer`, formData);
  }

  setCustomerActiveStatus(customerId: any, status: boolean): Observable<any> {
    let formData = new FormData();
    formData.append('customerId', customerId);
    formData.append('status', status.toString());
    return this._http.post<any>(`${environment.baseUrl}Customer/SetCustomerActiveStatus`, formData);
  }
}
