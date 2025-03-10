import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar los botones Registrarse y Loguearse para usuarios no logueados', () => {
    // Aseguramos que el usuario no está logueado.
    component.isLoggedIn = false;
    fixture.detectChanges();

    const registerButton = fixture.debugElement.query(By.css('.btn'));
    expect(registerButton).toBeTruthy();
    expect(registerButton.nativeElement.textContent).toContain('Registrarse');
  });

  it('debería mostrar los enlaces Mis Colecciones y Añadir moneda para usuarios logueados', () => {
    // Simulamos que el usuario está logueado.
    component.isLoggedIn = true;
    fixture.detectChanges();

    const navItems = fixture.debugElement.queryAll(By.css('.navbar-right .nav-item'));
    const texts = navItems.map(el => el.nativeElement.textContent.trim());
    expect(texts).toContain('Mis Colecciones');
    expect(texts).toContain('Añadir moneda');
  });
});
