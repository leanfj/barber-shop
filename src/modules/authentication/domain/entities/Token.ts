import type DataExpiracao from '../../../../core/domain/valueObjects/DataExpiracao';
import Entity from '../../../../core/domain/entities/Entity';
import type UniqueEntityId from '../../../../core/domain/entities/UniqueEntityId';
import TokenVO from '../../../../core/domain/valueObjects/TokenVO';

interface TokenProps {
  id?: string;
  token: TokenVO | string;
  usuarioId: string;
  tenantId: string;
  dataExpiracao: DataExpiracao;
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
    if (this.props.token instanceof TokenVO) {
      return this.props.token.getValue();
    }

    return this.props.token;
  }

  get usuarioId(): string {
    return this.props.usuarioId;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get dataExpiracao(): string {
    return this.props.dataExpiracao.getValue();
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
