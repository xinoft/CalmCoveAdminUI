import { Component } from "@angular/core";
import { AuthenticationService } from "../../../authentication/services/authentication.service";

@Component({
	selector: "app-error-unauthorized",
	standalone: true,
	imports: [],
	templateUrl: "./error-unauthorized.component.html",
	styleUrl: "./error-unauthorized.component.css",
})
export class ErrorUnauthorizedComponent {
	constructor(private _authService: AuthenticationService) {
		this.initializeMainComponent();
	}

	initializeMainComponent() {
		this._authService.removeAuthData();
	}
}
