import { Routes } from "@angular/router";
import { authGuard } from "../authentication/guards/auth.guard";
import { MassageListComponent } from "./massage-list/massage-list.component";
import { ReviewListComponent } from "./review-list/review-list.component";

export const massageRoutes: Routes = [
    {
        path: "massage",
        redirectTo: "massage/massage-list",
    },
    {
        path: "massage",
        canActivate: [authGuard],
        children:[
            {
                path:'massage-list',
                component:MassageListComponent
            },
            {
                path:'review-list',
                component:ReviewListComponent
            }
        ]
    }
];