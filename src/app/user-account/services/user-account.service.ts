import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SharedService } from "../../shared/services/shared.service";
import { Observable } from "rxjs";
import { ApiResponse } from "../../shared/models/ApiResponse";
import { UserAccount } from "../models/UserAccount";
import { environment } from "../../../environments/environment";
import { UserPermission } from "../../shared/models/UserPermission";
import { UserPermissionMapping } from "../models/UserPermissionMapping";

@Injectable({
	providedIn: "root",
})
export class UserAccountService {
	constructor(private _http: HttpClient, private _sharedService: SharedService) {}

	getUserAccountList(searchKeyword: string, sortField: string, sortOrder: string): Observable<any> {
		var params = new HttpParams().append("SearchKeyword", searchKeyword).append("SortField", sortField).append("SortOrder", sortOrder);
		return this._http.get<ApiResponse<UserAccount[]>>(`${environment.baseUrl}UserAccount/GetUserAccountList`, { params: params });
	}

	getUserAccount(id:number): Observable<any> {
		var params = new HttpParams().append("id", id);
		return this._http.get<ApiResponse<UserAccount>>(`${environment.baseUrl}UserAccount/GetUserAccountById`, { params: params });
	}

	getUserMappingList(userGroupId: number): Observable<any> {
		var params = new HttpParams().append("userId", userGroupId);
		return this._http.get<ApiResponse<UserPermissionMapping[]>>(`${environment.baseUrl}Permission/GetUserMappingList`, { params: params });
	}

	getUserPermissions(): Observable<any> {
		return this._http.get<ApiResponse<UserPermission[]>>(`${environment.baseUrl}Permission/GetUserPermissions`);
	}

	updateUserPermissions(data: any): Observable<any> {
		return this._http.post<any>(`${environment.baseUrl}Permission/ModifyUserPermission`, data, this._sharedService.getHeaderPost());
	}

	removeUserAccount(userId: any): Observable<any> {
		let formData = new FormData()
		formData.append("userId", userId);
		return this._http.post<any>(`${environment.baseUrl}UserAccount/RemoveUserAccount`, formData);
	}

	createUser(data: any): Observable<any> {
        return this._http.post(`${environment.baseUrl}UserAccount/CreateUserAccount`, data);
    }

	updateUser(data: any): Observable<any> {
        return this._http.post(`${environment.baseUrl}UserAccount/UpdateUserAccount`, data);
    }

	changePassword(newPassword: string): Observable<any> {
		const formData = new FormData();
		formData.append("newPassword", newPassword);
		return this._http.post<ApiResponse<any>>(`${environment.baseUrl}UserAccount/ChangePassword`, formData);
	}
}
