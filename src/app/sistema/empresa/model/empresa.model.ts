
export class Empresa {
    id!: string;
    razaoSocial!: string;
    sigla?: string;
    cnpj?: string;
  
    constructor(data?: Partial<Empresa>) {
      Object.assign(this, data);
    }
  }