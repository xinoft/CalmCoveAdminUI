import { Routes } from "@angular/router";
import { authGuard } from "../authentication/guards/auth.guard"; 
import { BookingListComponent } from "./booking-list/booking-list.component";

export const bookingRoutes: Routes = [
    {
        path: "booking",
        redirectTo: "booking/booking-list",
    },
    {
        path: "booking",
        canActivate: [authGuard],
        children:[
            {
                path:'booking-list',
                component:BookingListComponent
            }
        ]
    }
];