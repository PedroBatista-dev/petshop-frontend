import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService, BaseComponent, cnpjValidator, NotificationService, RegisterClientPayload, telefoneValidator } from 'shared';
import { AutoFocusDirective, ControlErrorDisplayDirective, PrimeiraLetraMaiusculaDirective } from 'shared';
import { MaterialImports } from '../../material/material.imports';

@Component({
  selector: 'app-register-enterprise',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MaterialImports,
    NgxMaskDirective,
    ControlErrorDisplayDirective,
    PrimeiraLetraMaiusculaDirective,
    AutoFocusDirective,
  ],
  templateUrl: './register-enterprise.component.html',
  styleUrl: './register-enterprise.component.scss'
})
export class RegisterEnterpriseComponent extends BaseComponent {

  passwordStrength = 0; 
  passwordStrengthText = 'Nenhuma';
  passwordStrengthColor = 'warn';

  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    protected override fb: FormBuilder,
    protected override router: Router,
    @Inject(NotificationService) protected override notificationService: NotificationService,
    @Inject(AuthService) protected override authService: AuthService,
  ) {
    super(fb, router, notificationService, authService);
    
  }

  override onBuildForm(): void {
    this.form = this.fb.group({
      razaoSocial: ['', [Validators.required, Validators.minLength(3)]],
      descricaoEmpresa: ['', [Validators.required, Validators.minLength(3)]],
      cnpj: ['', [Validators.required, cnpjValidator()]],
      telefone: ['', [Validators.required, telefoneValidator()]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  override onSubmit(): void {
    if (this.form.invalid) {
      this.notificationService.error('Erro no Formulário', 'Por favor, preencha todos os campos corretamente.');
      this.markAllFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;

    const { confirmPassword, ...formDataWithoutConfirmPassword } = this.form.value;

    const payload = new RegisterClientPayload(formDataWithoutConfirmPassword);

    this.authService.registerEnterprise(payload).pipe(
      finalize(() => {
        this.isLoading = false;
        this.form.reset();
      })
    ).subscribe({
      next: () => this.onBackToLogin(),
      error: (err) => 
        console.error('Erro ao registrar empresa:', err)
    });
  }
}
