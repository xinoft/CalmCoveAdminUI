export class UserPermission {
	Id: number;
	Name: string;
	Code: string;
	Add: boolean = false;
	View: boolean = false;
	Update: boolean = false;
	Remove: boolean = false;
	Approve: boolean = false;
	IsDeleted: boolean;
	IsActive: boolean;
	CreatedTime: string;
	CreatedBy: null | string; // Assuming CreatedBy could be a string in other cases
	LastUpdatedTime: string;
	LastUpdatedBy: null | string; // Assuming LastUpdatedBy could be a string in other cases

	constructor() {
		this.Id = 0;
		this.Name = "";
		this.Code = "";
		this.IsDeleted = false;
		this.IsActive = true;
		this.CreatedTime = "";
		this.CreatedBy = null;
		this.LastUpdatedTime = "";
		this.LastUpdatedBy = null;
	}
}
