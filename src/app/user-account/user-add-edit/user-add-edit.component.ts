import { Component, Input } from "@angular/core";
import { UtilityService } from "../../shared/services/utility.service";
import { MultiSelectModule } from "primeng/multiselect";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { UserAccount } from "../models/UserAccount";
import { UserGroup } from "../../user-group/models/UserGroup";
import { UserGroupService } from "../../user-group/services/user-group.service";
import { ApiResponse } from "../../shared/models/ApiResponse";
import { ToastMessage, ToastType } from "../../shared/models/ToastMessage";
import { UserAccountService } from "../services/user-account.service";

@Component({
	selector: "app-user-add-edit",
	standalone: true,
	imports: [MultiSelectModule, FormsModule, ReactiveFormsModule],
	templateUrl: "./user-add-edit.component.html",
	styleUrl: "./user-add-edit.component.css",
})
export class UserAddEditComponent {
	@Input() userAccountMode = "";
	@Input() refresUserAccountList: any;
	userGroupList: UserGroup[] = [];
	selectedUserGroupList: number[] = [];
	userForm: any;

	constructor(private _utilityService: UtilityService, private _userGroupService: UserGroupService, private _userAccountService: UserAccountService) {
		this.getUserGroupList();
		this.initUserFormGroup(new UserAccount());
	}

	initUserFormGroup(userAccount: UserAccount) {
		this.userForm = new FormGroup({
			userId: new FormControl(userAccount.Id), // Assuming default value as 0 for new users
			firstName: new FormControl(userAccount.FirstName, Validators.required),
			lastName: new FormControl(userAccount.LastName, Validators.required),
			email: new FormControl(userAccount.Email, Validators.required),
			phone: new FormControl(userAccount.Phone, Validators.required),
			password: new FormControl(userAccount.Password),
			mappedGroupIds: new FormControl([], Validators.required),
		});
		this.selectedUserGroupList = userAccount.UserGroupMappings.map((mapping) => mapping.UserGroup.Id);
	}

	getUserGroupList() {
		this._utilityService.showLoader(true);
		this._userGroupService.getUserGroupList("").subscribe((response: ApiResponse<UserGroup[]>) => {
			if (response.Success) {
				this.userGroupList = response.Result;
			}
			this._utilityService.showLoader(false);
		});
	}

	onSubmitUserForm() {
		this.patchGroupMappings();
		if (!this.userForm.valid) {
			this.setUserModifyErrorMessage("Please provide valid inputs");
			return;
		}
		if (this.userAccountMode == "Update") {
			this.updateUserAccount();
		} else {
			this.createUserAccount();
		}
	}

	createUserAccount() {
		this._utilityService.showLoader(true);
		this._userAccountService.createUser(this.userForm.value).subscribe((response: ApiResponse<UserAccount>) => {
			if (response.Success) {
				this.setUserModifySuccessState(response);
			} else {
				this.setUserModifyErrorMessage(response.ErrorMessage);
			}
			this._utilityService.showLoader(false);
		});
	}

	updateUserAccount() {
		this._utilityService.showLoader(true);
		this._userAccountService.updateUser(this.userForm.value).subscribe((response: ApiResponse<UserAccount>) => {
			if (response.Success) {
				this.setUserModifySuccessState(response);
			} else {
				this.setUserModifyErrorMessage(response.ErrorMessage);
			}
			this._utilityService.showLoader(false);
		});
	}

	patchGroupMappings() {
		this.userForm.patchValue({
			mappedGroupIds: this.selectedUserGroupList,
		});
	}

	setUserModifySuccessState(response: ApiResponse<UserAccount>) {
		this._utilityService.showToast(new ToastMessage(ToastType.Success, response.SuccessMessage, "User Account"));
		this.refresUserAccountList();
		this._utilityService.showModal(false, "user-add-edit");
	}

	setUserModifyErrorMessage(message: any) {
		this._utilityService.showToast(new ToastMessage(ToastType.Error, message, "User Account"));
	}
}
