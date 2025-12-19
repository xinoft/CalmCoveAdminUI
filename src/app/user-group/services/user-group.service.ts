import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../../shared/models/ApiResponse";
import { UserGroup } from "../models/UserGroup";
import { UserGroupPermission } from "../models/UserGroupPermission";
import { UserPermission } from "../../shared/models/UserPermission";
import { SharedService } from "../../shared/services/shared.service";

@Injectable({
	providedIn: "root",
})
export class UserGroupService {
	constructor(private _http: HttpClient, private _sharedService: SharedService) {}

	getUserGroupList(userGroupName: string): Observable<any> {
		var params = new HttpParams().append("groupName", userGroupName);
		return this._http.get<ApiResponse<UserGroup[]>>(`${environment.baseUrl}Permission/GetUserGroupList`, { params: params });
	}

	getUserGroupMappingList(userGroupId: number): Observable<any> {
		var params = new HttpParams().append("userGroupId", userGroupId);
		return this._http.get<ApiResponse<UserGroupPermission[]>>(`${environment.baseUrl}Permission/GetUserGroupMappingList`, { params: params });
	}

	getUserPermissions(): Observable<any> {
		return this._http.get<ApiResponse<UserPermission[]>>(`${environment.baseUrl}Permission/GetUserPermissions`);
	}

	updateUserGroupPermissions(data: any): Observable<any> {
		return this._http.post<any>(`${environment.baseUrl}Permission/ModifyGroupPermission`, data, this._sharedService.getHeaderPost());
	}

	createUserGroupPermissions(data: any): Observable<any> {
		return this._http.post<any>(`${environment.baseUrl}Permission/CreateUserGroupPermission`, data, this._sharedService.getHeaderPost());
	}

	removeUserGroup(id: number) {
		var data = {
			userGroupId: id,
		};
		return this._http.post<any>(`${environment.baseUrl}Permission/RemoveUserGroup`, data, this._sharedService.getHeaderPost());
	}
}
