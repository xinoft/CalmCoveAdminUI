import { Injectable } from "@angular/core";
import { UserPermission } from "../models/UserPermission";

@Injectable({
	providedIn: "root",
})
export class PermissionService {
	isPermissionSelectAllCheck = false;

	constructor() {}

	generatePermissionRequestPayloadMapping(userPermissionList: UserPermission[]) {
		let permissionList: any = [];
		userPermissionList.forEach((element) => {
			let permission = {
				permissionId: element.Id,
				add: element.Add,
				view: element.View,
				update: element.Update,
				remove: element.Remove,
				approve: element.Approve,
			};
			permissionList.push(permission);
		});
		return permissionList;
	}

	resetUserPermissionMappingList(userPermissionList: UserPermission[]) {
		userPermissionList.forEach((element) => {
			element.Add = element.View = element.Update = element.Remove = false;
			//Set approve to false, when using this
			element.Approve = true;
		});
	}
}
