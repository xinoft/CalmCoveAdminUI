import { Routes } from "@angular/router";
import { authGuard } from "../authentication/guards/auth.guard";
import { PromotionListComponent } from "./promotion-list/promotion-list.component";

export const promotionRoutes: Routes = [
    {
        path: "promotion",
        redirectTo: "promotion/promotion-list",
    },
    {
        path: "promotion",
        canActivate: [authGuard],
        children:[
            {
                path:'promotion-list',
                component:PromotionListComponent
            }
        ]
    }
];