import { Component, Injectable, OnInit, ViewChild } from "@angular/core";
import { TableModule } from "primeng/table";
import { UserAccountService } from "../services/user-account.service";
import { UtilityService } from "../../shared/services/utility.service";
import { ApiResponse } from "../../shared/models/ApiResponse";
import { UserAccount } from "../models/UserAccount";
import { UserPermissionMapping } from "../models/UserPermissionMapping";
import { UserPermission } from "../../shared/models/UserPermission";
import { PermissionListComponent } from "../../shared/components/permission-list/permission-list.component";
import { UserGroupService } from "../../user-group/services/user-group.service";
import { ToastMessage, ToastType } from "../../shared/models/ToastMessage";
import { PermissionService } from "../../shared/services/permission.service";
import { FormsModule } from "@angular/forms";
import { UserAddEditComponent } from "../user-add-edit/user-add-edit.component";

@Component({
	selector: "app-user-list",
	standalone: true,
	imports: [TableModule, FormsModule, PermissionListComponent, UserAddEditComponent],
	templateUrl: "./user-list.component.html",
	styleUrl: "./user-list.component.css",
})
export class UserListComponent implements OnInit {
	@ViewChild("userAddEdit") userAddEditComponent: UserAddEditComponent | null = null;
	userAccountList: UserAccount[] = [];
	selectedUserAccount: UserAccount = new UserAccount();
	userPermissionMappingList: UserPermissionMapping[] = [];
	userPermissionList: UserPermission[] = [];
	searchKeyword = "";
	sortField = "";
	sortOrder = "";
	selectedUserId = 0;
	selectedUserName = "";
	userAccountMode = "";

	constructor(private _userAccountService: UserAccountService, private _userGroupService: UserGroupService, private _utilityService: UtilityService, private _permissionService: PermissionService) {}

	ngOnInit(): void {
		this.getUserAccountList();
		this.getUserPermissionMasterList();
	}

	onUserListSort(event: any) {
		this.sortField = event.field;
		this.sortOrder = event.order === 1 ? "asc" : "desc";
		this.getUserAccountList();
	}

	clearUseraccountListFilter() {
		this.searchKeyword = "";
		this.sortField = "";
		this.sortOrder = "";
		this.getUserAccountList();
	}

	getUserAccountList() {
		this._utilityService.showLoader(true);
		this._userAccountService.getUserAccountList(this.searchKeyword, this.sortField, this.sortOrder).subscribe((response: ApiResponse<UserAccount[]>) => {
			if (response.Success) {
				this.userAccountList = response.Result;
			}
			this._utilityService.showLoader(false);
		});
	}

	get getUserAccountListFromChild() {
		return this.getUserAccountList.bind(this);
	}

	removeUserAccount(id: number) {
		if (!window.confirm("Are you sure you want to remove this User")) {
			return;
		}
		this._utilityService.showLoader(true);
		this._userAccountService.removeUserAccount(id).subscribe((response: ApiResponse<null>) => {
			if (response.Success) {
				this._utilityService.showToast(new ToastMessage(ToastType.Success, response.SuccessMessage, "User Account"));
				this.getUserAccountList();
			} else {
				this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, "User Account"));
			}
			this._utilityService.showLoader(false);
		});
	}

	startCreateUserProcess() {
		this.userAccountMode = "Create";
		this.userAddEditComponent?.initUserFormGroup(new UserAccount());
		this._utilityService.showModal(true, "user-add-edit");
	}

	startUpdateUserProcess(id: number) {
		this.userAccountMode = "Update";
		this._utilityService.showLoader(true);
		this._userAccountService.getUserAccount(id).subscribe((response: ApiResponse<UserAccount>) => {
			if (response.Success) {
				this.selectedUserAccount = response.Result;
				this.userAddEditComponent?.initUserFormGroup(this.selectedUserAccount);
			}
			this._utilityService.showLoader(false);
		});
		this._utilityService.showModal(true, "user-add-edit");
	}

	//Permission related functions

	getUserPermissionMasterList() {
		this._utilityService.showLoader(true);
		this._userGroupService.getUserPermissions().subscribe((response: ApiResponse<UserPermission[]>) => {
			if (response.Success) {
				this.userPermissionList = response.Result;
			}
			this._utilityService.showLoader(false);
		});
	}

	getUserMappingListForUpdating(userId: number, name: string) {
		this._utilityService.showLoader(true);
		this.selectedUserName = name;
		this.selectedUserId = userId;
		this._userAccountService.getUserMappingList(userId).subscribe((response: ApiResponse<UserPermissionMapping[]>) => {
			if (response.Success) {
				this.setUserGroupMappingResponse(response);
			}
			this._utilityService.showLoader(false);
		});
	}

	setUserGroupMappingResponse(response: ApiResponse<UserPermissionMapping[]>) {
		this.userPermissionMappingList = response.Result;
		this._permissionService.isPermissionSelectAllCheck = false;
		this._permissionService.resetUserPermissionMappingList(this.userPermissionList);
		this.setUserPermissionListWithValues();
		this._utilityService.showModal(true, "user-permission-modify");
	}

	setUserPermissionListWithValues() {
		let allGranted = true;
		this.userPermissionList.forEach((element) => {
			let mapping = this.userPermissionMappingList.find((x) => x.Permission.Code == element.Code);
			if (mapping) {
				this.mapUserPermissionToUserMapping(mapping, element);
				if (!(element.Add && element.View && element.Update && element.Remove && element.Approve)) {
					allGranted = false;
				}
			} else {
				allGranted = false;
			}
		});
		this._permissionService.isPermissionSelectAllCheck = allGranted;
	}

	mapUserPermissionToUserMapping(mapping: UserPermissionMapping, element: UserPermission) {
		element.Add = mapping.Add;
		element.View = mapping.View;
		element.Update = mapping.Update;
		element.Remove = mapping.Remove;
		element.Approve = mapping.Approve;
	}

	updateUserPermission() {
		this._utilityService.showLoader(true);
		let jsonData = this.generatePermissionRequestPayload(true, this.selectedUserId, this.userPermissionList);
		this._userAccountService.updateUserPermissions(jsonData).subscribe((response: ApiResponse<UserPermission[]>) => {
			if (response.Success) {
				this._utilityService.showToast(new ToastMessage(ToastType.Success, response.SuccessMessage, "User Permission"));
				this._utilityService.showModal(false, "user-permission-modify");
			} else {
				this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, "User Permission"));
			}
			this._utilityService.showLoader(false);
		});
	}

	generatePermissionRequestPayload(isUserPermission: boolean, id: number, userPermissionList: UserPermission[]): string {
		let payload = {
			...(isUserPermission ? { userId: id } : { groupId: id }),
			permissionList: this._permissionService.generatePermissionRequestPayloadMapping(userPermissionList),
		};
		return JSON.stringify(payload);
	}
}
