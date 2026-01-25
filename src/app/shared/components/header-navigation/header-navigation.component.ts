import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { AuthenticationService } from "../../../authentication/services/authentication.service";
import { UserAccountService } from "../../../user-account/services/user-account.service";
import { UtilityService } from "../../services/utility.service";
import { ToastMessage, ToastType } from "../../models/ToastMessage";
import { Router } from "@angular/router";

@Component({
	selector: "app-header-navigation",
	standalone: true,
	imports: [CommonModule, FormsModule, DialogModule],
	templateUrl: "./header-navigation.component.html",
	styleUrl: "./header-navigation.component.css",
})
export class HeaderNavigationComponent {
	
	userName = "John Doe";
	showChangePasswordModal: boolean = false;
	newPassword: string = "";
	confirmPassword: string = "";
	passwordErrors: string[] = [];

	constructor(
		private _authService: AuthenticationService,
		private _userAccountService: UserAccountService,
		private _utilityService: UtilityService,
		private _routerService: Router
	) {
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

	openChangePasswordModal(): void {
		this.resetPasswordForm();
		this.showChangePasswordModal = true;
	}

	closeChangePasswordModal(): void {
		this.showChangePasswordModal = false;
		this.resetPasswordForm();
	}

	resetPasswordForm(): void {
		this.newPassword = "";
		this.confirmPassword = "";
		this.passwordErrors = [];
	}

	validatePasswordForm(): boolean {
		this.passwordErrors = [];

		if (!this.newPassword.trim()) {
			this.passwordErrors.push("New password is required");
		}

		if (!this.confirmPassword.trim()) {
			this.passwordErrors.push("Confirm password is required");
		}

		if (this.newPassword && this.confirmPassword && this.newPassword !== this.confirmPassword) {
			this.passwordErrors.push("New password and confirm password do not match");
		}

		if (this.newPassword && this.newPassword.length < 6) {
			this.passwordErrors.push("New password must be at least 6 characters long");
		}

		return this.passwordErrors.length === 0;
	}

	changePassword(): void {
		if (!this.validatePasswordForm()) {
			return;
		}

		this._utilityService.showLoader(true);
		this._userAccountService.changePassword(this.newPassword).subscribe({
			next: (response) => {
				if (response.Success) {
					this._utilityService.showToast(new ToastMessage(ToastType.Success, "Password changed successfully", "Success"));
					this.closeChangePasswordModal();
				} else {
					this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage || "Failed to change password", "Error"));
				}
				this._utilityService.showLoader(false);
			},
			error: (error) => {
				console.error("Error changing password:", error);
				this._utilityService.showToast(new ToastMessage(ToastType.Error, "Failed to change password. Please try again.", "Error"));
				this._utilityService.showLoader(false);
			}
		});
	}
}
