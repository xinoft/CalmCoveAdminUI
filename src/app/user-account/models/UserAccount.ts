import { UserGroupPermission } from "../../user-group/models/UserGroupPermission";

export class UserAccount {
	Id: number;
	FirstName: string;
	LastName: string;
	Phone: string;
	Email: string;
	Password: string;
	IsDeleted: boolean;
	IsActive: boolean;
	CreatedTime: Date;
	CreatedBy: string | null;
	LastUpdatedTime: Date;
	LastUpdatedBy: string | null;
	UserGroupMappings: UserGroupPermission[];

	constructor() {
		this.Id = 0;
		this.FirstName = "";
		this.LastName = "";
		this.Phone = "";
		this.Email = "";
		this.Password = "";
		this.IsDeleted = false;
		this.IsActive = true;
		this.CreatedTime = new Date();
		this.CreatedBy = null;
		this.LastUpdatedTime = new Date();
		this.LastUpdatedBy = null;
		this.UserGroupMappings = [];
	}
}
