import { Routes } from "@angular/router";
import { MainLayoutComponent } from "../shared/components/main-layout/main-layout.component";
import { authGuard } from "../authentication/guards/auth.guard";
import { UserGroupListComponent } from "./user-group-list/user-group-list.component";

export const userGroupRoutes: Routes = [
	{
		path: "user-group",
		redirectTo: "user-group/group-list",
	},
	{
		path: "user-group",
		canActivate: [authGuard],
		children:[
			{
				path:'group-list',
				component:UserGroupListComponent
			}
		]
	}
];
