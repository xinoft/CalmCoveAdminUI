import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../shared/models/ApiResponse';
import { environment } from '../../environments/environment';
import { PromotionListRequest } from './models/PromotionListRequest';
import { PromotionModel } from './models/PromotionModel';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private _http: HttpClient) { }

  getPromotionList(request: PromotionListRequest): Observable<any> {
    return this._http.post<ApiResponse<PromotionModel[]>>(`${environment.baseUrl}promotion/promotionlist`, request);
  }
}
