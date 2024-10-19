import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';
import { DashboardComponent } from "./components/dashboard/dashboard.component";

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
