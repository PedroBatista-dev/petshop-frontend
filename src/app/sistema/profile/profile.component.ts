import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, takeUntil } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';
import { BaseComponent } from '../../shared/components/base/base.component';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { AuthService } from '../../auth/service/auth.service';
import { EmpresaService } from '../empresa/service/empresa.service';
import { MaterialImports } from '../../shared/material/material.imports';
import { GenericAutocompleteComponent, AutocompleteItem } from '../../shared/components/generic-autocomplete/generic-autocomplete.component';
import { ControlErrorDisplayDirective } from '../../shared/directives/control-error-display.directive';
import { UpdateUserProfilePayload, UserProfile } from '../../auth/model/auth.model';
import { cpfValidator } from '../../shared/validators/cpf.validator';
import { dateFormatValidator } from '../../shared/validators/date-format.validator';
import { telefoneValidator } from '../../shared/validators/telefone.validator';
import { ProfilePictureUploadComponent } from '../../shared/components/profile-picture-upload/profile-picture-upload.component';
import { ProfileService } from './service/profile.service';
import { Empresa } from '../empresa/model/empresa.model';
// Importe o ChangePasswordComponent se for usá-lo em um MatDialog
// import { MatDialog } from '@angular/material/dialog';
// import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MaterialImports,
    NgxMaskDirective,
    ControlErrorDisplayDirective,
    GenericAutocompleteComponent,
    ProfilePictureUploadComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent implements OnInit {

  userProfile: UserProfile | null = null;
  selectedProfilePicture: File | null = null;

  constructor(
    protected override fb: FormBuilder,
    protected override router: Router,
    @Inject(NotificationService) protected override notificationService: NotificationService,
    @Inject(AuthService) protected override authService: AuthService,
    @Inject(EmpresaService) public empresaService: EmpresaService,
    @Inject(ProfileService) public profileService: ProfileService,
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
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      empresaAutocomplete: [{ value: '', disabled: true }, Validators.required],
      idEmpresa: [{ value: '', disabled: true }],
    });
  }

  public get empresaAutocompleteControl(): FormControl {
    return this.form.get('empresaAutocomplete') as FormControl;
  }

  ngOnInit(): void {
    this.setAuthUser();
  }

  setAuthUser(): void {
    this.authService.getUserProfile().pipe(takeUntil(this.destroy$)).subscribe(profile => {
      if (profile) {
        this.userProfile = profile;
        if(!this.userProfile.foto) {
          this.userProfile.foto = 'logo.jpg';
        }
        this.populateForm(profile);
      }
    });
  }

  populateForm(profile: UserProfile): void {
    this.profileService.get(`${profile.userId}`).pipe(takeUntil(this.destroy$)).subscribe(usuario => {
        if (usuario) {
            this.form.patchValue(
              {
                ...usuario,
                dataNascimento: new Date(`${usuario.dataNascimento}T12:00:00`),
              });

            if (usuario.idEmpresa) {
                this.empresaService.get<Empresa>(usuario.idEmpresa).subscribe(empresa => {
                    this.empresaAutocompleteControl.setValue(empresa);
                    this.form.get('idEmpresa')?.setValue(empresa.id);
                });
            }
        }
    })
  }
  
  onEmpresaSelected(selectedItem: AutocompleteItem): void {
    this.form.get('idEmpresa')?.setValue(selectedItem.id);
  }

  onProfilePictureSelected(file: File): void {
    this.selectedProfilePicture = file;
  }

  openChangePasswordDialog(): void {
    // Exemplo de como abrir o componente em um Dialog do Angular Material
    // this.dialog.open(ChangePasswordComponent, {
    //   width: '450px',
    //   disableClose: true
    // });
    this.notificationService.warning('Funcionalidade Pendente', 'A tela de alteração de senha ainda não foi implementada com um MatDialog.');
  }

  override onSubmit(): void {
    if (this.form.invalid) {
      this.notificationService.error('Formulário Inválido', 'Por favor, verifique os campos.');
      this.markAllFormFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    this.formatDate('dataNascimento');

    const payload = new UpdateUserProfilePayload(this.form.value);

    this.authService.updateUserProfile(payload, this.userProfile!.userId, this.selectedProfilePicture).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.setAuthUser();
      },
      error: (err) => {
        console.error('Erro ao atualizar perfil:', err);
      }
    });
  }
}