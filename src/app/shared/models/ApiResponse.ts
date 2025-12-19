export class ApiResponse<T> {
    Success: boolean;
    Error: boolean;
    Warning: boolean;
    SuccessMessage: string;
    ErrorMessage: string;
    WarningMessage: string;
    Result: T;

    constructor() {
        this.Success = false;
        this.Error = false;
        this.Warning = false;
        this.SuccessMessage = "";
        this.ErrorMessage = "";
        this.WarningMessage = "";
        this.Result = {} as T;
    }
}