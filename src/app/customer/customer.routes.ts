import { Routes } from "@angular/router";
import { authGuard } from "../authentication/guards/auth.guard";
import { CustomerListComponent } from "./customer-list/customer-list.component";

export const customerRoutes: Routes = [
    {
        path: "customer",
        redirectTo: "customer/customer-list",
    },
    {
        path: "customer",
        canActivate: [authGuard],
        children:[
            {
                path:'customer-list',
                component:CustomerListComponent
            }
        ]
    }
];