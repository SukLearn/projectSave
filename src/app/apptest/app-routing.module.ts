import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components START
import { RegistrationComponent } from './Components/registration/registration.component';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/home/home.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AdminComponent } from './Components/admin/admin.component';
// Components END

// Auth Guard START
import { AuthGuard } from './Services/auth.guard.service';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { ErrorComponent } from './Components/error/error.component';
import { Error400Component } from './Components/error400/error400.component';
// Auth Guard END

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  }, // Default Route
  { path: 'home', component: HomeComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'error-400', component: Error400Component }, // if status is 400 go to this page
  // Guarded Routes START
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  // Guarded Routes END

  { path: 'error', component: ErrorComponent }, // define what is error
  { path: '**', redirectTo: 'error' }, // if route isn't found it goes to error page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingComponents = [
  RegistrationComponent,
  LoginComponent,
  HomeComponent,
  DashboardComponent,
  AdminComponent,
  NavbarComponent,
  Error400Component,
  ErrorComponent,
]; // Good practice to write in array so it take less place in app.module.ts and change dynamically (yes we need to import there too)
