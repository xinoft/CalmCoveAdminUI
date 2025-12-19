import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const authenticationRoutes: Routes = [
  {
    path: 'auth',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: 
    [
        { path: 'login', component: LoginComponent }
    ],
  },
];
