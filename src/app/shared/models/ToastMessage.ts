export class ToastMessage {
	Type: ToastType;
	Message: string;
	Title?: string;

	constructor(type: ToastType, message: string, title?: string) {
		this.Type = type;
		this.Message = message;
		this.Title = title;
	}
}

export enum ToastType {
	Success = 1,
	Error = 2,
	Warning = 3,
}
