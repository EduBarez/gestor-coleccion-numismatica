import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AdminGuard } from './guards/admin.guard';
import { MonedasComponent } from './monedas/monedas.component';
import { CrearMonedaComponent } from './crearmoneda/crearmoneda.component';
import { VermonedaComponent } from './vermoneda/vermoneda.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'gestion-usuarios',
        component: UserManagementComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'monedas',
        component: MonedasComponent,
      },
      {
        path: 'crear-moneda',
        component: CrearMonedaComponent,
      },
      {
        path: 'monedas/:id',
        component: VermonedaComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  { path: '**', redirectTo: '' },
];
