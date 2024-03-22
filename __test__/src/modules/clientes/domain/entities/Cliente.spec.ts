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
});
