import { PermissionMapping } from "../../shared/models/PermissionMapping";

export class UserGroupPermission {
	Id: number;
	UserGroup: any; // Adjust the type based on your actual data model or set to 'null' if it's nullable
	Permission: PermissionMapping;
	Add: boolean;
	View: boolean;
	Update: boolean;
	Remove: boolean;
	Approve: boolean;
	IsDeleted: boolean;
	IsActive: boolean;
	CreatedTime: string;
	CreatedBy: any; // Adjust the type based on your actual data model
	LastUpdatedTime: string;
	LastUpdatedBy: any; // Adjust the type based on your actual data model

	constructor() {
		this.Id = 0;
		this.UserGroup = null;
		this.Permission = new PermissionMapping();
		this.Add = false;
		this.View = false;
		this.Update = false;
		this.Remove = false;
		this.Approve = false;
		this.IsDeleted = false;
		this.IsActive = true;
		this.CreatedTime = "";
		this.CreatedBy = null;
		this.LastUpdatedTime = "";
		this.LastUpdatedBy = null;
	}
}
