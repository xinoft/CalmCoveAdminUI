import { Routes } from "@angular/router";
import { MainLayoutComponent } from "../shared/components/main-layout/main-layout.component";
import { authGuard } from "../authentication/guards/auth.guard";
import { UserListComponent } from "./user-list/user-list.component";

export const userAccountRoutes: Routes = [
	{
		path: "user-account",
		redirectTo: "user-account/user-list",
	},
	{
		path: "user-account",
		canActivate: [authGuard],
		children:[
			{
				path:'user-list',
				component:UserListComponent
			}
		]
	}
];