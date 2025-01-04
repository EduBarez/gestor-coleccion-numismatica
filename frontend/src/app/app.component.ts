import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MonedaService } from './services/moneda.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent implements OnInit {
  title = 'gestor-coleccion-numismatica';
  monedas: any[] = [];  // Variable para almacenar las monedas

  constructor(private monedaService: MonedaService) {}

  // Método que se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.monedaService.getMonedas().subscribe((data) => {
      this.monedas = data;
      console.log(this.monedas);  // Mostrar las monedas en la consola
    });
  }
}
