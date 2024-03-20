import Entity from 'core/domain/entities/Entity';
import { type UniqueEntityId } from 'core/domain/entities/UniqueEntityId';
import type Email from 'core/domain/valueObjects/Email';

interface ClienteProps {
  id?: string;
  nome: string;
  email: Email;
  genero: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  cpf: string;
  dataEvento: Date;
  dataCadastro?: Date;
  dataAtualizacao?: Date;
}

export class Cliente extends Entity<ClienteProps> {
  constructor(props: ClienteProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  get nome(): string {
    return this.props.nome;
  }

  get email(): string {
    return this.props.email.getValue();
  }

  get genero(): string {
    return this.props.genero;
  }

  get telefone(): string {
    return this.props.telefone;
  }

  get endereco(): string {
    return this.props.endereco;
  }

  get cidade(): string {
    return this.props.cidade;
  }

  get estado(): string {
    return this.props.estado;
  }

  get cep(): string {
    return this.props.cep;
  }

  get cpf(): string {
    return this.props.cpf;
  }

  get dataCadastro(): Date | undefined {
    return this.props.dataCadastro;
  }

  get dataAtualizacao(): Date | undefined {
    return this.props.dataAtualizacao;
  }

  static create(props: ClienteProps, id?: UniqueEntityId): Cliente {
    return new Cliente(props, id);
  }
}
