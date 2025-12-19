import { Component, OnInit } from "@angular/core";
import { UserGroupService } from "../services/user-group.service";
import { ApiResponse } from "../../shared/models/ApiResponse";
import { UserGroup } from "../models/UserGroup";
import { UtilityService } from "../../shared/services/utility.service";
import { UserGroupPermission } from "../models/UserGroupPermission";
import { PermissionListComponent } from "../../shared/components/permission-list/permission-list.component";
import { FormsModule } from "@angular/forms";
import { UserPermission } from "../../shared/models/UserPermission";
import { ToastMessage, ToastType } from "../../shared/models/ToastMessage";
import { PermissionService } from "../../shared/services/permission.service";

@Component({
	selector: "app-user-group-list",
	standalone: true,
	imports: [FormsModule, PermissionListComponent],
	templateUrl: "./user-group-list.component.html",
	styleUrl: "./user-group-list.component.css",
})
export class UserGroupListComponent implements OnInit {
	userGroupList: UserGroup[] = [];
	userGroupPermissionList: UserGroupPermission[] = [];
	userPermissionList: UserPermission[] = [];
	userGroupFormMode = "Create";
	seletecUserGroupId = 0;
	userGroupName = "";
	userGroupSearchKeyword = "";

	constructor(private _userGroupService: UserGroupService, private _utilityService: UtilityService, private _permissionService: PermissionService) {
		this.getUserPermissionMasterList();
		this.getUserGroupList();
	}

	ngOnInit(): void {}

	getUserGroupList() {
		this._utilityService.showLoader(true);
		this._userGroupService.getUserGroupList(this.userGroupSearchKeyword).subscribe((response: ApiResponse<UserGroup[]>) => {
			if (response.Success) {
				this.userGroupList = response.Result;
			}
			this._utilityService.showLoader(false);
		});
	}

	clearUserGroupList() {
		this.userGroupSearchKeyword = "";
		this.getUserGroupList();
	}

	getUserPermissionMasterList() {
		this._utilityService.showLoader(true);
		this._userGroupService.getUserPermissions().subscribe((response: ApiResponse<UserPermission[]>) => {
			if (response.Success) {
				this.userPermissionList = response.Result;
			}
			this._utilityService.showLoader(false);
		});
	}

	modifyUserGroup() {
		switch (this.userGroupFormMode) {
			case "Create":
				this.createUserGroup();
				break;
			case "Update":
				this.updateUserGroup();
				break;
			case "Clone":
				this.createUserGroup();
				break;
			default:
				break;
		}
	}

	updateUserGroup() {
		this._utilityService.showLoader(true);
		let jsonData = this.generatePermissionRequestPayload(false, this.seletecUserGroupId, this.userPermissionList);
		this._userGroupService.updateUserGroupPermissions(jsonData).subscribe((response: ApiResponse<UserPermission[]>) => {
			if (response.Success) {
				this._utilityService.showToast(new ToastMessage(ToastType.Success, response.SuccessMessage, "UserGroup"));
				const userGroup = this.userGroupList.find((x) => x.Id == this.seletecUserGroupId);
				if (userGroup) {
					userGroup.Name = this.userGroupName;
				}
				this._utilityService.showModal(false, "user-group-permission-modify");
			} else {
				this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, "UserGroup"));
			}
			this._utilityService.showLoader(false);
		});
	}

	createUserGroup() {
		this._utilityService.showLoader(true);
		let jsonData = this.generatePermissionRequestPayload(false, this.seletecUserGroupId, this.userPermissionList);
		this._userGroupService.createUserGroupPermissions(jsonData).subscribe((response: ApiResponse<UserPermission[]>) => {
			if (response.Success) {
				this._utilityService.showToast(new ToastMessage(ToastType.Success, response.SuccessMessage, "UserGroup"));
				this.getUserGroupList();
				this._utilityService.showModal(false, "user-group-permission-modify");
			} else {
				this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, "UserGroup"));
			}
			this._utilityService.showLoader(false);
		});
	}

	removeUserGroup(id: number) {
		if (!window.confirm("Are you sure you want to remove UserGroup")) {
			return;
		}
		this._utilityService.showLoader(true);
		this._userGroupService.removeUserGroup(id).subscribe((response: ApiResponse<null>) => {
			if (response.Success) {
				this._utilityService.showToast(new ToastMessage(ToastType.Success, response.SuccessMessage, "User Group"));
				this.getUserGroupList();
			} else {
				this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, "Use rGroup"));
			}
			this._utilityService.showLoader(false);
		});
	}

	newUserGroupWithMapping() {
		this.userGroupFormMode = "Create";
		this.userGroupName = "";
		this._permissionService.isPermissionSelectAllCheck = false;
		this._permissionService.resetUserPermissionMappingList(this.userPermissionList);
		this._utilityService.showModal(true, "user-group-permission-modify");
	}

	getUserGroupMappingListForUpdating(userGroupId: number, userGroupName: string) {
		this._utilityService.showLoader(true);
		this.userGroupFormMode = "Update";
		this.userGroupName = userGroupName;
		this.seletecUserGroupId = userGroupId;
		this._userGroupService.getUserGroupMappingList(userGroupId).subscribe((response: ApiResponse<UserGroupPermission[]>) => {
			if (response.Success) {
				this.setUserGroupMappingResponse(response);
			}
			this._utilityService.showLoader(false);
		});
	}

	getUserGroupForCloning(userGroupId: number) {
		this._userGroupService.getUserGroupMappingList(userGroupId).subscribe((response: ApiResponse<UserGroupPermission[]>) => {
			if (response.Success) {
				this.setUserGroupMappingResponse(response);
				this.userGroupFormMode = "Clone";
				this.userGroupName = "";
			}
			this._utilityService.showLoader(false);
		});
	}

	setUserGroupMappingResponse(response: ApiResponse<UserGroupPermission[]>) {
		this._permissionService.isPermissionSelectAllCheck = false;
		this.userGroupPermissionList = response.Result;
		this._permissionService.resetUserPermissionMappingList(this.userPermissionList);
		this.setUserPermissionListWithValues();
		this._utilityService.showModal(true, "user-group-permission-modify");
	}

	setUserPermissionListWithValues() {
		let allGranted = true;
		this.userPermissionList.forEach((element) => {
			let mapping = this.userGroupPermissionList.find((x) => x.Permission.Code == element.Code);
			if (mapping) {
				this.mapUserPermissionToUserGroupMapping(mapping, element);
				if (!(element.Add && element.View && element.Update && element.Remove && element.Approve)) {
					allGranted = false;
				}
			} else {
				allGranted = false;
			}
		});
		this._permissionService.isPermissionSelectAllCheck = allGranted;
	}

	mapUserPermissionToUserGroupMapping(mapping: UserGroupPermission, element: UserPermission) {
		element.Add = mapping.Add;
		element.View = mapping.View;
		element.Update = mapping.Update;
		element.Remove = mapping.Remove;
		element.Approve = mapping.Approve;
	}

	generatePermissionRequestPayload(isUserPermission: boolean, id: number, userPermissionList: UserPermission[]): string {
		if (this.userGroupName == "") {
			this._utilityService.showToast(new ToastMessage(ToastType.Error, "Please enter a valid User Group name", "User Group"));
			this._utilityService.showLoader(false);
			return "";
		}
		let payload = {
			...(isUserPermission ? { userId: id } : { groupId: id }),
			groupName: this.userGroupName,
			permissionList: this._permissionService.generatePermissionRequestPayloadMapping(userPermissionList),
		};
		return JSON.stringify(payload);
	}
}
