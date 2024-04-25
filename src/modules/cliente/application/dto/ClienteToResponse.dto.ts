export default class ClienteToResponseDTO {
  id: string;
  tenantId: string;
  nome: string;
  cpf: string;
  dataNascimento: Date | string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  genero: string;
  cep: string;
  dataCadastro: Date;
  dataAtualizacao: Date;

  constructor(props: {
    id: string;
    tenantId: string;
    nome: string;
    cpf: string;
    dataNascimento: Date | string;
    email: string;
    telefone: string;
    endereco: string;
    cidade: string;
    estado: string;
    genero: string;
    cep: string;
    dataCadastro: Date;
    dataAtualizacao: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.nome = props.nome;
    this.cpf = props.cpf;
    this.dataNascimento = props.dataNascimento;
    this.email = props.email;
    this.telefone = props.telefone;
    this.endereco = props.endereco;
    this.cidade = props.cidade;
    this.estado = props.estado;
    this.genero = props.genero;
    this.cep = props.cep;
    this.dataCadastro = props.dataCadastro;
    this.dataAtualizacao = props.dataAtualizacao;
  }

  static create(props: {
    id: string;
    tenantId: string;
    nome: string;
    cpf: string;
    dataNascimento: Date | string;
    email: string;
    telefone: string;
    endereco: string;
    cidade: string;
    estado: string;
    genero: string;
    cep: string;
    dataCadastro: Date;
    dataAtualizacao: Date;
  }): ClienteToResponseDTO {
    return new ClienteToResponseDTO(props);
  }
}
