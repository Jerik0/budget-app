import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import {TransactionManagementComponent} from "./components/transaction-management/transaction-management.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'transaction-management',
    component: TransactionManagementComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {}),
    DashboardComponent,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
