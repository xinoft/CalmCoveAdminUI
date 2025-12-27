import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../shared/models/ApiResponse';
import { environment } from '../../environments/environment';
import { PromotionListRequest } from './models/PromotionListRequest';
import { PromotionModel } from './models/PromotionModel';
import { PromotionItemModel } from './models/PromotionItemModel';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private _http: HttpClient) { }

  getPromotionList(request: PromotionListRequest): Observable<any> {
    return this._http.post<ApiResponse<PromotionModel[]>>(`${environment.baseUrl}promotion/promotionlist`, request);
  }

  getPromotion(id: number): Observable<any> {
    const params = new HttpParams().append('id', id);
    return this._http.get<ApiResponse<PromotionModel>>(`${environment.baseUrl}Promotion/GetPromotion`, { params: params });
  }

  getPromotionItemList(promotionId: number): Observable<any> {
    const params = new HttpParams().append('promotionId', promotionId);
    return this._http.get<ApiResponse<PromotionItemModel[]>>(`${environment.baseUrl}Promotion/GetPromotionItemList`, { params: params });
  }

  createPromotion(data: any): Observable<any> {
    return this._http.post(`${environment.baseUrl}Promotion/Create`, data);
  }

  updatePromotion(data: any): Observable<any> {
    return this._http.post(`${environment.baseUrl}Promotion/Update`, data);
  }
}
