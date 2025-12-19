import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class SharedService {
	constructor() {}

	getHeaderPost() {
		return {
			headers: { "Content-Type": "application/json" },
		};
	}
}
