export class LoginResponse {
	Name: string;
	Token: string;
	RoleList: string[];
	Success: boolean;
	Error: boolean;
	Warning: boolean;
	SuccessMesssage: string;
	ErrorMessage: string;
	WarningMessage: string;
	Result: any | null;

	constructor() {
		this.Name = "";
		this.Token = "";
		this.RoleList = [];
		this.Success = false;
		this.Error = false;
		this.Warning = false;
		this.SuccessMesssage = "";
		this.ErrorMessage = "";
		this.WarningMessage = "";
		this.Result = null;
	}
}
