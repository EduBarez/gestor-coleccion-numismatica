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
import { LoginRegisterComponent } from './layout/login-register/login-register.component';
import { ModificarMonedaComponent } from './modificarmoneda/modificarmoneda.component';
import { ColeccionesComponent } from './colecciones/colecciones.component';
import { CrearColeccionComponent } from './crearcoleccion/crearcoleccion.component';
import { ColeccionDetalleComponent } from './coleccionDetalle/coleccionDetalle.component';
import { AgregarMonedasComponent } from './agregarMonedasColeccion/agregarMonedasColeccion.component';
import { QuitarMonedasColeccionComponent } from './quitarMonedasColeccion/quitarMonedasColeccion.component';
import { TriviaExamenComponent } from './triviaExamen/triviaExamen.component';
import { CrearTriviaComponent } from './crearTrivia/crearTrivia.component';
import { MisColeccionesComponent } from './miscolecciones/miscolecciones.component';
import { OwnerOrAdminGuard } from './guards/propietarioOadmin.guard';
import { UserGuard } from './guards/user.guard';
import { PropietarioGuard } from './guards/propietario.guard';

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
        canActivate: [UserGuard],
      },
      {
        path: 'monedas/:id',
        component: VermonedaComponent,
      },
      {
        path: 'modificar-monedas/:id',
        component: ModificarMonedaComponent,
        canActivate: [OwnerOrAdminGuard],
      },
      {
        path: 'colecciones',
        component: ColeccionesComponent,
      },
      {
        path: 'colecciones/crear',
        component: CrearColeccionComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'colecciones/:id',
        component: ColeccionDetalleComponent,
      },
      {
        path: 'colecciones/:id/agregar-monedas',
        component: AgregarMonedasComponent,
        canActivate: [PropietarioGuard],
      },
      {
        path: 'colecciones/:id/quitar-monedas',
        component: QuitarMonedasColeccionComponent,
        canActivate: [OwnerOrAdminGuard],
      },
      {
        path: 'mis-colecciones',
        component: MisColeccionesComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'trivia-examen',
        component: TriviaExamenComponent,
      },
      {
        path: 'anadir-preguntas-trivia',
        component: CrearTriviaComponent,
      },
    ],
  },
  {
    path: '',
    component: LoginRegisterComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
