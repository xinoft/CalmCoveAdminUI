import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from '../shared/services/shared.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../shared/models/ApiResponse';
import { MassageModel } from './models/MassageModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MassageService {

  constructor(private _http: HttpClient, private _sharedService: SharedService) { }

  getMassageList(searchKeyword: string): Observable<any> {
    var params = new HttpParams().append("SearchKeyword", searchKeyword);
    return this._http.get<ApiResponse<MassageModel[]>>(`${environment.baseUrl}Massage/List`, { params: params });
  }

  createMassage(massage: MassageModel): Observable<any> {
    return this._http.post<ApiResponse<MassageModel>>(`${environment.baseUrl}Massage/Create`, massage);
  }

  updateMassage(massage: MassageModel): Observable<any> {
    return this._http.post<ApiResponse<MassageModel>>(`${environment.baseUrl}Massage/Update`, massage);
  }

  saveMassage(massage: any): Observable<any> {
    if (massage.id && massage.id > 0) {
      return this.updateMassage(massage);
    } else {
      return this.createMassage(massage);
    }
  }

  getMassageById(id: number): Observable<any> {
    var params = new HttpParams().append("id", id);
    return this._http.get<ApiResponse<MassageModel>>(`${environment.baseUrl}Massage/Get`, { params: params });
  }

  deleteMassage(id: number): Observable<any> {
    const formData = new FormData();
    formData.append('massageId', id.toString());
    return this._http.post<ApiResponse<boolean>>(`${environment.baseUrl}Massage/Remove`, formData);
  }
}
