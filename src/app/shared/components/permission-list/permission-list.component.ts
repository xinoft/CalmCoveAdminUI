import { Component, EventEmitter, Input, Output } from "@angular/core";
import { UserGroupPermission } from "../../../user-group/models/UserGroupPermission";
import { FormsModule } from "@angular/forms";
import { UserPermission } from "../../models/UserPermission";
import { PermissionService } from "../../services/permission.service";

@Component({
	selector: "app-permission-list",
	standalone: true,
	imports: [FormsModule],
	templateUrl: "./permission-list.component.html",
	styleUrl: "./permission-list.component.css",
})
export class PermissionListComponent {
	@Input() userPermissionList: UserPermission[] = [];

	constructor(public _permissionService: PermissionService) {}

	selectAll(event: Event) {
		const isChecked = (event.target as HTMLInputElement).checked;
		this.userPermissionList.forEach((element) => {
			element.Add = isChecked;
			element.View = isChecked;
			element.Update = isChecked;
			element.Remove = isChecked;
			element.Approve = isChecked;
		});
	}

	selectAllCheckChange() {
		let allGranted = true;
		this.userPermissionList.forEach((element) => {
			if (!(element.Add && element.View && element.Update && element.Remove && element.Approve)) {
				allGranted = false;
			}
		});
		this._permissionService.isPermissionSelectAllCheck = allGranted;
	}
}
