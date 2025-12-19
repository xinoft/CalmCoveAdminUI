import { Routes } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { authGuard } from "../authentication/guards/auth.guard";
import { ErrorNotFoundComponent } from "./components/error-not-found/error-not-found.component";
import { ErrorCommonComponent } from "./components/error-common/error-common.component";
import { ErrorUnauthorizedComponent } from "./components/error-unauthorized/error-unauthorized.component";
import { MainLayoutComponent } from "./components/main-layout/main-layout.component";

export const sharedRoutes: Routes = [
	{
		path: "dashboard",
		redirectTo: "dashboard/overview",
	},
	{
		path: "dashboard",
		canActivate: [authGuard],
		children:[
			{
				path:'overview',
				component:DashboardComponent
			}
		]
	},
	{
		path: "error",
		redirectTo: "error/common-error",
	},
	{
		path: "error",
		children: [
			{
				path: "common",
				component: ErrorCommonComponent,
			},
			{
				path: "unauthorized",
				component: ErrorUnauthorizedComponent,
			},
			{
				path: "notfound",
				component: ErrorNotFoundComponent,
			},
		],
	},
	{
		path: "*",
		component: ErrorNotFoundComponent,
		canActivate: [authGuard],
	},
];
