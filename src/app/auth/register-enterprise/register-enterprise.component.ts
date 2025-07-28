import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { MaterialImports } from '../../shared/material/material.imports';
import { ControlErrorDisplayDirective } from '../../shared/directives/control-error-display.directive';
import { PrimeiraLetraMaiusculaDirective } from '../../shared/directives/first-capital-letter.directive';
import { AutoFocusDirective } from '../../shared/directives/auto-focus.directive';
import { BaseComponent } from '../../shared/components/base/base.component';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { AuthService } from '../service/auth.service';
import { cnpjValidator } from '../../shared/validators/cnpj.validator';
import { telefoneValidator } from '../../shared/validators/telefone.validator';
import { RegisterClientPayload } from '../model/auth.model';

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