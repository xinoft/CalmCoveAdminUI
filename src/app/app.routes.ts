import { Routes } from '@angular/router';
import { authenticationRoutes } from './authentication/authentication.routes';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { sharedRoutes } from './shared/shared.routes';
import { LoginComponent } from './authentication/login/login.component';
import { userGroupRoutes } from './user-group/user-group.routes';
import { userAccountRoutes } from './user-account/user-account-routes';
import { massageRoutes } from './massage/massage-routes';
import { promotionRoutes } from './promotion/promotion.route';
import { customerRoutes } from './customer/customer.routes';
import { bookingRoutes } from './booking/booking.route';

export const routes: Routes = [
    {
        path:'',
        component:LoginComponent
    },
    ...authenticationRoutes,
    ...userAccountRoutes,
    ...userGroupRoutes,
    ...massageRoutes,
    ...promotionRoutes,
    ...customerRoutes,
    ...bookingRoutes,
    ...sharedRoutes,

];
