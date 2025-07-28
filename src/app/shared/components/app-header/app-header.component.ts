import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserProfile } from '../../../auth/model/auth.model';
import { AuthService } from '../../../auth/service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  searchControl = new FormControl('');
  userProfile: UserProfile | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe(user => user ? this.userProfile = user : this.userProfile = null);
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Espera 300ms após a última digitação
        distinctUntilChanged() // Emite apenas se o valor for diferente do anterior
      )
      .subscribe((searchValue) => {
        this.search.emit(searchValue || '');
      });
  }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  onLogout(): void {
    this.authService.logout();
    // Redirecionamento será tratado pelo AuthGuard ou NoAuthGuard
  }

  // Exemplo de como você pode navegar para a página de perfil
  onViewProfile(): void {
    console.log('Navegar para a página de perfil');
    // Implemente a navegação para a página de perfil do usuário aqui
  }
}