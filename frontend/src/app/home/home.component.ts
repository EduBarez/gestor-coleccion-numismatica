import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // Simula el estado del usuario: false = visitante, true = usuario registrado.
  public isLoggedIn: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // Aquí podrías chequear el estado de autenticación real.
  }

  onRegister(): void {
    // Lógica o navegación hacia la página de registro.
    console.log('Botón Registrarse clicado');
  }

  onLogin(): void {
    // Lógica o navegación hacia la página de login.
    console.log('Botón Loguearse clicado');
  }

}
