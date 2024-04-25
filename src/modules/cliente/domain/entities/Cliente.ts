import Entity from '../../../../core/domain/entities/Entity';
import CPF from '../../../../core/domain/valueObjects/CPF';
import Email from '../../../../core/domain/valueObjects/Email';
import type UniqueEntityId from '../../../../core/domain/entities/UniqueEntityId';

interface ClienteProps {
  id?: string;
  tenantId: string;
  nome: string;
  email: Email | string;
  genero: string | undefined;
  telefone: string | undefined;
  endereco: string | undefined;
  cidade: string | undefined;
  estado: string | undefined;
  cep: string | undefined;
  cpf: CPF | string;
  dataNascimento?: Date;
  dataCadastro?: Date;
  dataAtualizacao?: Date;
}

export default class Cliente extends Entity<ClienteProps> {
  constructor(props: ClienteProps, id?: UniqueEntityId) {
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
    return this.props.email instanceof Email
      ? this.props.email.getValue()
      : this.props.email;
  }

  get genero(): string | undefined {
    return this.props.genero;
  }

  get telefone(): string | undefined {
    return this.props.telefone;
  }

  get endereco(): string | undefined {
    return this.props.endereco;
  }

  get cidade(): string | undefined {
    return this.props.cidade;
  }

  get estado(): string | undefined {
    return this.props.estado;
  }

  get cep(): string | undefined {
    return this.props.cep;
  }

  get cpf(): string {
    return this.props.cpf instanceof CPF
      ? this.props.cpf?.getValue()
      : this.props.cpf;
  }

  get dataCadastro(): Date | undefined {
    return this.props.dataCadastro;
  }

  get dataAtualizacao(): Date | undefined {
    return this.props.dataAtualizacao;
  }

  get dataNascimento(): Date | undefined {
    return this.props.dataNascimento;
  }

  public calculaIdade(): number {
    if (!this.dataNascimento) {
      return 0;
    }

    const diff = Date.now() - this.dataNascimento.getTime();
    const ageDate = new Date(diff);
    const ages = Math.abs(ageDate.getUTCFullYear() - 1970);

    return ages;
  }

  static create(props: ClienteProps, id?: UniqueEntityId): Cliente {
    return new Cliente(props, id);
  }
}
