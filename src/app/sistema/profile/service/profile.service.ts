// src/app/shared/services/empresa/empresa.service.ts
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../shared/services/notification/notification.service';
import { environment } from '../../../environments/environments';
import { BaseService } from '../../../shared/services/base/base.service';
import { Profile } from '../model/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService<Profile> { 

  constructor(
    protected override http: HttpClient,
    protected override notificationService: NotificationService,
    @Inject(PLATFORM_ID) protected override platformId: Object
  ) {
    super(http, notificationService, `${environment.backendAuthUrl}/usuarios`, platformId);
  }

}