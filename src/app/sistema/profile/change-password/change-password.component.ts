import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { NotificationService } from '../../../shared/services/notification/notification.service';
import { AuthService } from '../../../auth/service/auth.service';
import { MaterialImports } from '../../../shared/material/material.imports';
import { ControlErrorDisplayDirective } from '../../../shared/directives/control-error-display.directive';
import { strongPasswordValidator } from '../../../shared/validators/strong-password.validator';
import { matchPasswordsValidator } from '../../../shared/validators/match-passwords.validator';
import { ChangePasswordPayload } from '../../../auth/model/auth.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MaterialImports,
    ControlErrorDisplayDirective
  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends BaseComponent {

  hideCurrentPassword = true;
  hideNewPassword = true;
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
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, strongPasswordValidator()]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: matchPasswordsValidator('newPassword', 'confirmPassword')
    });
  }

  override onSubmit(): void {
    if (this.form.invalid) {
      this.notificationService.error('Formulário Inválido', 'Por favor, preencha todos os campos corretamente.');
      this.markAllFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    const payload: ChangePasswordPayload = {
      currentPassword: this.form.value.currentPassword,
      newPassword: this.form.value.newPassword
    };

    this.authService.changePassword(payload).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.notificationService.success('Sucesso', 'Senha alterada com sucesso!');
        this.form.reset();
        // Aqui você pode adicionar lógica para fechar o modal/dialog
      },
      error: (err) => {
        console.error('Erro ao alterar senha:', err);
      }
    });
  }
}