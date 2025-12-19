export class PermissionMapping {
	Id: number;
	Name: string;
	Code: string;
	IsDeleted: boolean;
	IsActive: boolean;
	CreatedTime: string;
	CreatedBy: any; // Adjust the type based on your actual data model
	LastUpdatedTime: string;
	LastUpdatedBy: any; // Adjust the type based on your actual data model

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
