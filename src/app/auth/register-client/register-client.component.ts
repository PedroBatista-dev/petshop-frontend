import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { Router } from '@angular/router';
import { debounceTime, finalize } from 'rxjs';
import zxcvbn from 'zxcvbn';
import { MaterialImports } from '../../shared/material/material.imports';
import { ControlErrorDisplayDirective } from '../../shared/directives/control-error-display.directive';
import { PrimeiraLetraMaiusculaDirective } from '../../shared/directives/first-capital-letter.directive';
import { AutoFocusDirective } from '../../shared/directives/auto-focus.directive';
import { AutocompleteItem, GenericAutocompleteComponent } from '../../shared/components/generic-autocomplete/generic-autocomplete.component';
import { BaseComponent } from '../../shared/components/base/base.component';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { AuthService } from '../service/auth.service';
import { cpfValidator } from '../../shared/validators/cpf.validator';
import { dateFormatValidator } from '../../shared/validators/date-format.validator';
import { telefoneValidator } from '../../shared/validators/telefone.validator';
import { strongPasswordValidator } from '../../shared/validators/strong-password.validator';
import { matchPasswordsValidator } from '../../shared/validators/match-passwords.validator';
import { RegisterClientPayload } from '../model/auth.model';
import { EmpresaService } from '../../sistema/empresa/service/empresa.service';


@Component({
  selector: 'app-register-client',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MaterialImports,
    NgxMaskDirective,
    ControlErrorDisplayDirective,
    PrimeiraLetraMaiusculaDirective,
    AutoFocusDirective,
    GenericAutocompleteComponent
  ],
  templateUrl: './register-client.component.html',
  styleUrl: './register-client.component.scss'
})
export class RegisterClientComponent extends BaseComponent implements OnInit {

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
    @Inject(EmpresaService) public empresaService: EmpresaService,
  ) {
    super(fb, router, notificationService, authService);
    
  }

  override onBuildForm(): void {
    this.form = this.fb.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, cpfValidator()]],
      dataNascimento: ['', [Validators.required, dateFormatValidator()]], 
      sexo: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      telefone: ['', [Validators.required, telefoneValidator()]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPasswordValidator()]],
      confirmPassword: ['', [Validators.required]],
      empresaAutocomplete: ['', [Validators.required]],
      idEmpresa: [''],
    },
    {
      validators: [
        matchPasswordsValidator('password', 'confirmPassword')
      ]
    });
  }

  public get empresaAutocompleteControl(): FormControl {
    return this.form.get('empresaAutocomplete') as FormControl;
  }

  ngOnInit(): void {
    this.form.get('password')?.valueChanges
      .pipe(
        debounceTime(300) 
      )
      .subscribe((password: string) => {
        if (password) {
          const result = zxcvbn(password);
          this.passwordStrength = (result.score + 1) * 20; 
          this.updatePasswordStrengthText(result.score);
        } else {
          this.passwordStrength = 0;
          this.passwordStrengthText = 'Nenhuma';
          this.passwordStrengthColor = 'warn';
        }
      });
  }

  onEmpresaSelected(selectedItem: AutocompleteItem): void {
    this.form.get('idEmpresa')?.setValue(selectedItem.id); 
  }

  private updatePasswordStrengthText(score: number): void {
    switch (score) {
      case 0:
        this.passwordStrengthText = 'Muito Fraca';
        this.passwordStrengthColor = 'warn';
        break;
      case 1:
        this.passwordStrengthText = 'Fraca';
        this.passwordStrengthColor = 'warn';
        break;
      case 2:
        this.passwordStrengthText = 'Média';
        this.passwordStrengthColor = 'accent';
        break;
      case 3:
        this.passwordStrengthText = 'Boa';
        this.passwordStrengthColor = 'primary';
        break;
      case 4:
        this.passwordStrengthText = 'Excelente';
        this.passwordStrengthColor = 'primary';
        break;
      default:
        this.passwordStrengthText = 'Nenhuma';
        this.passwordStrengthColor = 'warn';
    }
  }

  override onSubmit(): void {
    if (this.form.invalid) {
      this.notificationService.error('Erro no Formulário', 'Por favor, preencha todos os campos corretamente.');
      this.markAllFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;

    this.formatDate('dataNascimento');

    const { confirmPassword, empresaAutocomplete, ...formData } = this.form.value;

    const payload = new RegisterClientPayload(formData);

    this.authService.registerUser(payload).pipe(
      finalize(() => {
        this.isLoading = false;
        this.form.reset();
      })
    ).subscribe({
      next: () => this.onBackToLogin(),
      error: (err: any) => 
        console.error('Erro ao registrar usuário:', err)
    });
  }
}