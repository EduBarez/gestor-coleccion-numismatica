import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      // { path: 'monedas', component: MonedasComponent },
      // { path: 'colecciones', component: ColeccionesComponent },
      // { path: 'mis-colecciones', component: MisColeccionesComponent },
      // { path: 'trivia', component: TriviaComponent }
    ]
  },
  // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];
