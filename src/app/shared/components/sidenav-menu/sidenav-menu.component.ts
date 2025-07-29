import { Component, ChangeDetectionStrategy, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MaterialImports } from '../../material/material.imports';
import { AuthService } from '../../../auth/service/auth.service';

// --- Nenhuma alteração nas interfaces ---
interface Project {
  name: string;
  icon: string;
  screens: Screen[];
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
    RouterModule,
    ...MaterialImports
  ],
  templateUrl: './sidenav-menu.component.html',
  styleUrl: './sidenav-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavMenuComponent {
  @Output() navigate = new EventEmitter<void>();

  @ViewChild('leftSidenav') leftSidenav!: MatSidenav;
  @ViewChild('rightSidenav') rightSidenav!: MatSidenav;

  public selectedProject: Project | null = null;

  // Declara a propriedade 'isHandset$' sem inicializá-la aqui.
  public readonly isHandset$: Observable<boolean>;

  public projects: Project[] = [
    {
      name: 'Autenticação',
      icon: 'security',
      screens: [
        { name: 'Registrar Cliente', route: '/auth/register-client' },
        { name: 'Redefinir Senha', route: '/auth/reset-password' },
      ],
    },
    {
      name: 'Financeiro',
      icon: 'account_balance',
      screens: [{ name: 'Dashboard', route: '/financeiro/dashboard' }],
    },
  ];

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver 
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  async onProjectSelected(project: Project): Promise<void> {
    const isMobile = this.breakpointObserver.isMatched(Breakpoints.Handset);

    if (this.selectedProject === project) {
      this.selectedProject = null;
      if (isMobile) await this.rightSidenav?.close();
    } else {
      this.selectedProject = project;
      if (isMobile) {
        await this.leftSidenav?.close();
        await this.rightSidenav?.open();
      }
    }
  }
  
  async onBackToProjects(): Promise<void> {
    const isMobile = this.breakpointObserver.isMatched(Breakpoints.Handset);
    if (isMobile) {
      await this.rightSidenav?.close();
      await this.leftSidenav?.open();
    }
    this.selectedProject = null;
  }

  async onNavigate(): Promise<void> {
    const isMobile = this.breakpointObserver.isMatched(Breakpoints.Handset);
    this.navigate.emit();
    this.selectedProject = null;
    
    if (isMobile) {
      await this.leftSidenav?.close();
      await this.rightSidenav?.close();
    }
  }

  async onLogout(): Promise<void> {
    this.authService.logout();
    this.selectedProject = null;
    await this.onNavigate();
  }
}