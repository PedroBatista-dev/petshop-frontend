import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from '../../../shared/src/public-api';

export const routes: Routes = [
    { path: 'home', component: DashboardComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];
