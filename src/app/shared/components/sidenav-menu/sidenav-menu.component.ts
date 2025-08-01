import { Component, ChangeDetectionStrategy, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
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

  @ViewChild('leftSidenav') leftSidenav!: MatSidenav;
  @ViewChild('rightSidenav') rightSidenav!: MatSidenav;

  public selectedProject: Project | null = null;

  // Declara a propriedade 'isHandset$' sem inicializá-la aqui.
  public readonly isHandset$: Observable<boolean>;

  public projects: Project[] = [
    {
      name: 'Sistema',
      icon: 'settings',
      screens: [
        { name: 'Dashboard', route: '/dashboard' },
        { name: 'Perfil', route: '/profile' },
      ],
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