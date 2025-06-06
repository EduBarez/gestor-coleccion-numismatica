import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AprobarRechazarComponent } from './aprobarRechazar/aprobarRechazar.component';
import { AdminGuard } from './guards/admin.guard';
import { MonedasComponent } from './Moneda/monedas/monedas.component';
import { CrearMonedaComponent } from './Moneda/crearmoneda/crearmoneda.component';
import { VermonedaComponent } from './Moneda/vermoneda/vermoneda.component';
import { LoginRegisterComponent } from './layout/login-register/login-register.component';
import { ModificarMonedaComponent } from './Moneda/modificarmoneda/modificarmoneda.component';
import { ColeccionesComponent } from './Coleccion/colecciones/colecciones.component';
import { CrearColeccionComponent } from './Coleccion/crearcoleccion/crearcoleccion.component';
import { ColeccionDetalleComponent } from './Coleccion/coleccionDetalle/coleccionDetalle.component';
import { AgregarMonedasComponent } from './Coleccion/agregarMonedasColeccion/agregarMonedasColeccion.component';
import { QuitarMonedasColeccionComponent } from './Coleccion/quitarMonedasColeccion/quitarMonedasColeccion.component';
import { TriviaExamenComponent } from './Trivia/triviaExamen/triviaExamen.component';
import { CrearTriviaComponent } from './Trivia/crearTrivia/crearTrivia.component';
import { MisColeccionesComponent } from './Coleccion/miscolecciones/miscolecciones.component';
import { OwnerOrAdminGuard } from './guards/propietarioOadmin.guard';
import { UserGuard } from './guards/user.guard';
import { PropietarioGuard } from './guards/propietario.guard';
import { RankingComponent } from './Trivia/ranking/ranking.component';
import { EliminarUsuariosComponent } from './eliminarUsuarios/eliminarUsuarios.component';

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
        path: 'aprobar-rechazar',
        component: AprobarRechazarComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'eliminar-usuarios',
        component: EliminarUsuariosComponent,
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
        canActivate: [PropietarioGuard],
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
        canActivate: [UserGuard],
      },
      {
        path: 'ranking',
        component: RankingComponent,
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
