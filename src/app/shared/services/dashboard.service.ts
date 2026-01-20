import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardApiResponse } from '../models/dashboard.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiBaseUrl = '/api'; // Update with your actual API URL

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<DashboardApiResponse> {
    return this.http.get<DashboardApiResponse>(`${environment.baseUrl}Dashboard/GetDashboardData`);
  }
}
