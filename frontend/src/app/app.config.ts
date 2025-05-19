import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

export const appConfig = {
  providers: [
    importProvidersFrom(BrowserModule, BrowserAnimationsModule),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
  ],
};
