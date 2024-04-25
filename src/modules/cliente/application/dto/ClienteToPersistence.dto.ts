import CPF from '../../../../core/domain/valueObjects/CPF';
import Email from '../../../../core/domain/valueObjects/Email';

export default class ClienteToPersistenceDTO {
  tenantId: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  genero: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  dataNascimento: Date;
  dataCadastro: Date;
  dataAtualizacao: Date;

  constructor(props: {
    tenantId: string;
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    genero: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    dataNascimento: Date;
    dataCadastro: Date;
    dataAtualizacao: Date;
  }) {
    this.tenantId = props.tenantId;
    this.nome = props.nome;
    this.email = props.email;
    this.cpf = props.cpf;
    this.telefone = props.telefone;
    this.genero = props.genero;
    this.endereco = props.endereco;
    this.cidade = props.cidade;
    this.estado = props.estado;
    this.cep = props.cep;
    this.dataNascimento = props.dataNascimento;
    this.dataCadastro = props.dataCadastro;
    this.dataAtualizacao = props.dataAtualizacao;
  }

  static create(props: {
    tenantId: string;
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    genero: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    dataNascimento: Date;
    dataCadastro: Date;
    dataAtualizacao: Date;
  }): ClienteToPersistenceDTO {
    return new ClienteToPersistenceDTO({
      tenantId: props.tenantId,
      nome: props.nome,
      email: props.email ? Email.setValue(props.email).getValue() : '',
      cpf: props.cpf ? CPF.setValue(props.cpf).getValue() : '',
      telefone: props.telefone,
      genero: props.genero,
      endereco: props.endereco,
      cidade: props.cidade,
      estado: props.estado,
      cep: props.cep,
      dataNascimento: props.dataNascimento,
      dataCadastro: props.dataCadastro,
      dataAtualizacao: props.dataAtualizacao,
    });
  }
}
