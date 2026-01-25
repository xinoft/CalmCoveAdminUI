import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/models/ApiResponse';
import { ReviewModel } from '../models/ReviewModel';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private _http: HttpClient) { }

  getReviewList(approvalStatus: number): Observable<ApiResponse<ReviewModel[]>> {
    let params = new HttpParams().append('approvalStatus', approvalStatus);
    return this._http.get<ApiResponse<ReviewModel[]>>(`${environment.baseUrl}Booking/GetReviewList`, { params: params });
  }

  setReviewApprovalStatus(reviewId: number, approvalStatus: number): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('reviewId', reviewId.toString());
    formData.append('approvalStatus', approvalStatus.toString());
    return this._http.post<ApiResponse<any>>(`${environment.baseUrl}Booking/SetReviewApprovalStatus`, formData);
  }
}
