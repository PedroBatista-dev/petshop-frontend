import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-profile-picture-upload',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './profile-picture-upload.component.html',
  styleUrls: ['./profile-picture-upload.component.scss']
})
export class ProfilePictureUploadComponent {
  @Input() currentImageUrl: string | null | undefined = null;
  @Output() imageSelected = new EventEmitter<File>();

  selectedFileUrl: string | null = null;

  constructor(private notificationService: NotificationService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        this.notificationService.error('Formato Inválido', 'Por favor, selecione uma imagem PNG, JPG ou GIF.');
        return;
      }

      if (file.size > maxSizeInBytes) {
        this.notificationService.error('Arquivo Muito Grande', 'O tamanho da imagem não pode exceder 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileUrl = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.imageSelected.emit(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
}