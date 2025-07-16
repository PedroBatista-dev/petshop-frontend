import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { SidenavMenuComponent } from './components/sidenav-menu/sidenav-menu.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { AuthService } from 'shared';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    SidenavMenuComponent,
    AppHeaderComponent,
    AppFooterComponent,],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  title = 'petshop-shell';
  logado: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    // Escuta mudanças de login para redirecionar ou mostrar/esconder elementos
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      this.logado = isLoggedIn;
      if (!isLoggedIn) {
        this.router.navigate(['/auth/login']); // Redireciona para login se deslogado
      }
    });
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  onSearch(searchTerm: string): void {
    console.log('Pesquisar por:', searchTerm);
    // Implemente a lógica de pesquisa global aqui
    // Você pode usar um serviço compartilhado para notificar os microfrontends
    // ou filtrar as opções de menu, por exemplo.
  }
}
