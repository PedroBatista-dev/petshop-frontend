
export class Profile {
    id!: string;
    nomeCompleto!: string;
    cpf!: string;
    dataNascimento!: Date | string;
    sexo!: string;
    estadoCivil!: string;
    telefone!: string;
    email!: string;
    idEmpresa!: string;
  
    constructor(data?: Partial<Profile>) {
      Object.assign(this, data);
    }
  }