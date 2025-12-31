import { Component } from "@angular/core";
import { AuthenticationService } from "../../../authentication/services/authentication.service";
import { UtilityService } from "../../services/utility.service";
import { Router } from "@angular/router";

@Component({
	selector: "app-header-navigation",
	standalone: true,
	imports: [],
	templateUrl: "./header-navigation.component.html",
	styleUrl: "./header-navigation.component.css",
})
export class HeaderNavigationComponent {
	
	userName = "John Doe";	

	constructor(private _authService: AuthenticationService, private _utilityService: UtilityService, private _routerService: Router) {
		this.userName = localStorage.getItem("user_name") || "John Doe";
	}

	logout() {
		this._utilityService.showLoader(true);
		this._authService.logout();
		this._authService.removeAuthData();
		this._utilityService.showLoader(false);
		this._routerService.navigate([""]);
	}

	expandSideNav(){
		this._utilityService.expandSideNav()
	}
}
