import { Component, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/service/auth.service';

interface Project {
  name: string;
  icon: string;
  screens: Screen[];
  expanded: boolean;
}

interface Screen {
  name: string;
  route: string;
}

@Component({
  selector: 'app-sidenav-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatExpansionModule,
    RouterModule,
  ],
  templateUrl: './sidenav-menu.component.html',
  styleUrl: './sidenav-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavMenuComponent {
  @Output() navigate = new EventEmitter<void>();

  projects: Project[] = [
    {
      name: 'Autenticação',
      icon: 'security',
      screens: [
        { name: 'Registrar Cliente', route: '/register-client' },
        { name: 'Redefinir Senha', route: '/reset-password' },
      ],
      expanded: false,
    }
  ];

  constructor(private authService: AuthService) {}

  onLogout(): void {
    this.authService.logout();
    this.navigate.emit(); // Emitir evento para fechar o sidenav, se necessário
  }

  // Método para simular a navegação (pode ser ajustado para uso real)
  onNavigate(): void {
    this.navigate.emit();
    this.projects.forEach(p => p.expanded = false);
  }
}