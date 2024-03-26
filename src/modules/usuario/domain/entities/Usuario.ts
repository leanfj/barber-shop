import Entity from '../../../../core/domain/entities/Entity';
import type UniqueEntityId from '../../../../core/domain/entities/UniqueEntityId';

interface UsuarioProps {
  id?: string;
  tenantId: string;
  nome: string;
  email: string;
  password: string;
  isActive: boolean;
  dataCadastro: Date;
  dataAtualizacao: Date;
}

export default class Usuario extends Entity<UsuarioProps> {
  constructor(props: UsuarioProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get nome(): string {
    return this.props.nome;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string | undefined {
    return this.props.password;
  }

  get dataCadastro(): Date {
    return this.props.dataCadastro;
  }

  get dataAtualizacao(): Date {
    return this.props.dataAtualizacao;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  static create(props: UsuarioProps, id?: UniqueEntityId): Usuario {
    return new Usuario(props, id);
  }
}
