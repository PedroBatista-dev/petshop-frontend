// src/app/shared/services/empresa/empresa.service.ts
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NotificationService } from '../../../shared/services/notification/notification.service';
import { environment } from '../../../environments/environments';
import { Empresa } from '../model/empresa.model';
import { BaseService } from '../../../shared/services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService extends BaseService<Empresa> { 

  constructor(
    protected override http: HttpClient,
    protected override notificationService: NotificationService,
    @Inject(PLATFORM_ID) protected override platformId: Object
  ) {
    super(http, notificationService, `${environment.backendAuthUrl}/empresas`, platformId); // Endpoint para empresas
  }

  getAll(): Observable<Empresa[]> {
    this.notificationService.loading('Buscando empresas...');
    return this.get<Empresa[]>('').pipe( 
      finalize(() => this.notificationService.closeLoading())
    );
  }
}