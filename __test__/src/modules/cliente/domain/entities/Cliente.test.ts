import Tenant from '../../../../../../src/modules/tenant/domain/entities/Tenant';
import UniqueEntityId from '../../../../../../src/core/domain/entities/UniqueEntityId';
import CPF from '../../../../../../src/core/domain/valueObjects/CPF';
import Email from '../../../../../../src/core/domain/valueObjects/Email';
import Cliente from '../../../../../../src/modules/cliente/domain/entities/Cliente';

describe('Cliente', () => {
  it('should create a new Cliente', () => {
    const clienteCPF = CPF.setValue('155.766.660-11');
    const clienteEmail = Email.setValue('email@email.com');
    const clientId = new UniqueEntityId();
    const tenant = new Tenant(
      {
        nome: 'Teste',
        isAtivo: true,
        dataCadastro: new Date(),
        dataAtualizacao: new Date(),
      },
      new UniqueEntityId(),
    );
    const clienteData = {
      tenantId: tenant.id.toString(),
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
    expect(cliente.tenantId).toBe(tenant.id.toString());
  });

  it('should return the correct dataNascimento', () => {
    const clienteCPF = CPF.setValue('155.766.660-11');
    const clienteEmail = Email.setValue('email@email.com');
    const clientId = new UniqueEntityId();
    const tenant = new Tenant(
      {
        nome: 'Teste',
        isAtivo: true,
        dataCadastro: new Date(),
        dataAtualizacao: new Date(),
      },
      new UniqueEntityId(),
    );

    const clienteData = {
      tenantId: tenant.id.toString(),
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
    const clienteCPF = CPF.setValue('155.766.660-11');
    const clienteEmail = Email.setValue('email@example.com');
    const clientId = new UniqueEntityId();
    const tenant = new Tenant(
      {
        nome: 'Teste',
        isAtivo: true,
        dataCadastro: new Date(),
        dataAtualizacao: new Date(),
      },
      new UniqueEntityId(),
    );
    const clienteData = {
      tenantId: tenant.id.toString(),
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
    const clienteCPF = CPF.setValue('155.766.660-11');
    const clienteEmail = Email.setValue('email@example.com');
    const clientId = new UniqueEntityId();
    const tenant = new Tenant(
      {
        nome: 'Teste',
        isAtivo: true,
        dataCadastro: new Date(),
        dataAtualizacao: new Date(),
      },
      new UniqueEntityId(),
    );

    const clienteData = {
      tenantId: tenant.id.toString(),
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
