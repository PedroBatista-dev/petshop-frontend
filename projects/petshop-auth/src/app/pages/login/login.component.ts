import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { MaterialImports } from '../../material/material.imports.js';
import { AuthService, BaseComponent, ControlErrorDisplayDirective, LoginPayload, NotificationService } from 'shared';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ControlErrorDisplayDirective,
    ...MaterialImports,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent {

  constructor(
    protected override fb: FormBuilder,
    protected override router: Router,
    protected override notificationService: NotificationService,
    protected override authService: AuthService,
  ) {
    super(fb, router, notificationService, authService);
  }

  override onBuildForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  override onSubmit(): void {
    if (this.form.invalid) {
      this.notificationService.error('Erro no Formulário', 'Por favor, preencha todos os campos corretamente.');
      this.markAllFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;

    const payload = new LoginPayload(this.form.value);
    this.authService.login(payload).pipe(
      finalize(() => {
        this.isLoading = false;
        this.form.reset();
      })
    ).subscribe({
      next: (response) => console.log('Login bem-sucedido:', 'Bem-vindo(a) ao PetConnect!'),
      error: (err) => console.error('Erro durante o login:', err)
    });
  }

  onForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  onRegisterClient(): void {
    this.router.navigate(['/auth/register-client']);
  }
  
  onRegisterEnterprise(): void {
    this.router.navigate(['/auth/register-enterprise']);
  }

}
