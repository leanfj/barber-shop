import { UniqueEntityId } from '@core:domain/entities/UniqueEntityId';
import CPF from '@core:domain/valueObjects/CPF';
import Email from '@core:domain/valueObjects/Email';
import Cliente from '@modules/clientes/domain/entities/Cliente';

describe('Cliente', () => {
  it('should create a new Cliente', () => {
    const clienteCPF = new CPF('155.766.660-11');
    const clienteEmail = new Email('email@email.com');
    const clientId = new UniqueEntityId();
    const clienteData = {
      nome: 'John Doe',
      email: clienteEmail,
      genero: 'M',
      telefone: '2122222222',
      endereco: 'Rua Teste',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '22222222',
      cpf: clienteCPF,
      dataCadastro: new Date(),
      dataAtualizacao: new Date(),
      dataNascimento: new Date('1986-03-22 00:00:00'),
    };

    const cliente = new Cliente(clienteData, clientId);

    expect(cliente).toBeInstanceOf(Cliente);
    expect(cliente.cpf).toBe(clienteCPF.getValue());
    expect(cliente.email).toBe(clienteEmail.getValue());
    expect(cliente.id).toBe(clientId);
  });

  it('should return the correct dataNascimento', () => {
    const clienteCPF = new CPF('155.766.660-11');
    const clienteEmail = new Email('email@email.com');
    const clientId = new UniqueEntityId();

    const clienteData = {
      nome: 'John Doe',
      email: clienteEmail,
      genero: 'M',
      telefone: '2122222222',
      endereco: 'Rua Teste',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '22222222',
      cpf: clienteCPF,
      dataCadastro: new Date(),
      dataAtualizacao: new Date(),
      dataNascimento: new Date('1986-03-22 00:00:00'),
    };

    const cliente = new Cliente(clienteData, clientId);

    expect(cliente.dataNascimento).toEqual(new Date('1986-03-22 00:00:00'));
  });

  it('should return the correct nome', () => {
    const clienteCPF = new CPF('155.766.660-11');
    const clienteEmail = new Email('email@example.com');
    const clientId = new UniqueEntityId();

    const clienteData = {
      nome: 'Jane Doe',
      email: clienteEmail,
      genero: 'F',
      telefone: '2122222222',
      endereco: 'Rua Teste',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '22222222',
      cpf: clienteCPF,
      dataCadastro: new Date(),
      dataAtualizacao: new Date(),
      dataNascimento: new Date('1990-01-01 00:00:00'),
    };

    const cliente = new Cliente(clienteData, clientId);

    expect(cliente.nome).toBe('Jane Doe');
  });

  it('should calculate the correct age', () => {
    const clienteCPF = new CPF('155.766.660-11');
    const clienteEmail = new Email('email@example.com');
    const clientId = new UniqueEntityId();

    const clienteData = {
      nome: 'John Doe',
      email: clienteEmail,
      genero: 'M',
      telefone: '2122222222',
      endereco: 'Rua Teste',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '22222222',
      cpf: clienteCPF,
      dataCadastro: new Date(),
      dataAtualizacao: new Date(),
      dataNascimento: new Date('1986-03-22 00:00:00'),
    };

    const cliente = new Cliente(clienteData, clientId);

    expect(cliente.calculaIdade()).toBeGreaterThan(0);
  });
});
describe('Cliente', () => {
  // Existing tests...

  it('should calculate the correct age', () => {
    const clienteCPF = new CPF('155.766.660-11');
    const clienteEmail = new Email('email@example.com');
    const clientId = new UniqueEntityId();

    const clienteData = {
      nome: 'John Doe',
      email: clienteEmail,
      genero: 'M',
      telefone: '2122222222',
      endereco: 'Rua Teste',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '22222222',
      cpf: clienteCPF,
      dataCadastro: new Date(),
      dataAtualizacao: new Date(),
      dataNascimento: new Date('1986-03-22 00:00:00'),
    };

    const cliente = new Cliente(clienteData, clientId);

    expect(cliente.calculaIdade()).toBeGreaterThan(0);
  });

  it('should return 0 if dataNascimento is null', () => {
    const clienteCPF = new CPF('155.766.660-11');
    const clienteEmail = new Email('email@example.com');
    const clientId = new UniqueEntityId();

    const clienteData = {
      nome: 'John Doe',
      email: clienteEmail,
      genero: 'M',
      telefone: '2122222222',
      endereco: 'Rua Teste',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '22222222',
      cpf: clienteCPF,
      dataCadastro: new Date(),
      dataAtualizacao: new Date(),
      dataNascimento: undefined,
    };

    const cliente = new Cliente(clienteData, clientId);

    expect(cliente.calculaIdade()).toBe(0);
  });

  it('should return 0 if dataNascimento is undefined', () => {
    const clienteCPF = new CPF('155.766.660-11');
    const clienteEmail = new Email('email@example.com');
    const clientId = new UniqueEntityId();

    const clienteData = {
      nome: 'John Doe',
      email: clienteEmail,
      genero: 'M',
      telefone: '2122222222',
      endereco: 'Rua Teste',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '22222222',
      cpf: clienteCPF,
      dataCadastro: new Date(),
      dataAtualizacao: new Date(),
      dataNascimento: undefined,
    };

    const cliente = new Cliente(clienteData, clientId);

    expect(cliente.calculaIdade()).toBe(0);
  });
  it('should create a new Cliente using static create method', () => {
    const clienteCPF = new CPF('155.766.660-11');
    const clienteEmail = new Email('email@example.com');
    const clientId = new UniqueEntityId();

    const clienteData = {
      nome: 'John Doe',
      email: clienteEmail,
      genero: 'M',
      telefone: '2122222222',
      endereco: 'Rua Teste',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '22222222',
      cpf: clienteCPF,
      dataCadastro: new Date(),
      dataAtualizacao: new Date(),
      dataNascimento: new Date('1986-03-22 00:00:00'),
    };

    const cliente = Cliente.create(clienteData, clientId);

    expect(cliente).toBeInstanceOf(Cliente);
    expect(cliente.cpf).toBe(clienteCPF.getValue());
    expect(cliente.email).toBe(clienteEmail.getValue());
    expect(cliente.id).toBe(clientId);
  });
});
