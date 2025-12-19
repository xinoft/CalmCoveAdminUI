import { AfterViewInit, Component, OnInit } from "@angular/core";
import { UtilityService } from "../../shared/services/utility.service";
import { ToastMessage, ToastType } from "../../shared/models/ToastMessage";
import { AuthenticationService } from "../services/authentication.service";
import { Router } from "@angular/router";
import { LoginResponse } from "../models/LoginResponse";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrl: "./login.component.css",
})
export class LoginComponent {
	loginFormGroup = this.initLoginFormGroup();

	constructor(private _utlilityService: UtilityService, private _authService: AuthenticationService, private _routerService: Router) {
		this.redirectIfLoggedIn();
	}

	startLoginProcess() {
		this._utlilityService.showLoader(true);
		let username = this.loginFormGroup.value.UserName?.toString() || "";
		let password = this.loginFormGroup.value.Password?.toString() || "";
		this._authService.login(username, password).subscribe((response: LoginResponse) => {
			debugger;
			if (response.Success) {
				this.setLoginSuccessData(response);
				this._utlilityService.showLoader(false);
			} else {
				this._utlilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, "Login"));
				this.loginFormGroup.reset();
				this._utlilityService.showLoader(false);
			}
		});
	}

	initLoginFormGroup() {
		return new FormGroup({
			UserName: new FormControl("", [Validators.required]),
			Password: new FormControl("", [Validators.required]),
		});
	}

	setLoginSuccessData(response: LoginResponse) {
		this._authService.addAuthData(response);
		this._routerService.navigate(["dashboard"]);
	}

	redirectIfLoggedIn() {
		if (this._authService.isLoggedIn()) {
			this._routerService.navigate(["dashboard"]);
		}
	}
}
