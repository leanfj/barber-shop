import Entity from '../../../../core/domain/entities/Entity';
import type UniqueEntityId from '../../../../core/domain/entities/UniqueEntityId';

interface TokenProps {
  id?: string;
  token: string;
  usuarioId: string;
  tenantId: string;
  dataCadastro: Date;
  dataAtualizacao: Date;
}

export class Token extends Entity<TokenProps> {
  constructor(props: TokenProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  get token(): string {
    return this.props.token;
  }

  get usuarioId(): string {
    return this.props.usuarioId;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get dataCadastro(): Date {
    return this.props.dataCadastro;
  }

  get dataAtualizacao(): Date {
    return this.props.dataAtualizacao;
  }

  static create(props: TokenProps, id?: UniqueEntityId): Token {
    return new Token(props, id);
  }
}
