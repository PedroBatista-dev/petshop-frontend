import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { noAuthGuard } from './shared/guards/no-auth.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { RegisterClientComponent } from './auth/register-client/register-client.component';
import { RegisterEnterpriseComponent } from './auth/register-enterprise/register-enterprise.component';
import { authGuard } from './shared/guards/auth.guard';
import { DashboardComponent } from './sistema/dashboard/dashboard.component';
import { ProfileComponent } from './sistema/profile/profile.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
    { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [noAuthGuard] },
    { path: 'reset-password', component: ResetPasswordComponent, canActivate: [noAuthGuard] },
    { path: 'register-client', component: RegisterClientComponent, canActivate: [noAuthGuard] },
    { path: 'register-enterprise', component: RegisterEnterpriseComponent, canActivate: [noAuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
