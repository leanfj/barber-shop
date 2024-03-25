import { type UseCaseError } from '../../../../../../src/core/application/useCase/UseCaseError';
import CadastrarCliente, {
  type CadastrarClienteInput,
} from '../../../../../../src/modules/cliente/application/useCase/CadastrarCliente';
import type Cliente from '../../../../../../src/modules/cliente/domain/entities/Cliente';
import type IClienteRepository from '../../../../../../src/modules/cliente/domain/repositories/IClienteRepository';
import InMemoryClienteRepository from '../../../../../../src/modules/cliente/infrastructure/repositories/InMemoryCliente';

describe('CadastrarCliente', () => {
  let cadastrarCliente: CadastrarCliente;
  const input: CadastrarClienteInput = {
    nome: 'John Doe',
    email: 'email@email.com',
    genero: 'M',
    telefone: '2122222222',
    endereco: 'Rua Teste',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    cep: '22222222',
    cpf: '155.766.660-11',
    dataCadastro: new Date(),
    dataAtualizacao: new Date(),
    dataNascimento: new Date('1986-03-22 00:00:00'),
  };

  beforeEach(() => {
    const clienteRepository: IClienteRepository =
      new InMemoryClienteRepository();

    cadastrarCliente = new CadastrarCliente(clienteRepository);
  });

  it('should return CadastrarClienteSucesso if cliente is successfully created', async () => {
    const result = await cadastrarCliente.execute(input);
    const cliente = result.value.getValue() as Cliente;
    expect(cliente.nome).toBe('John Doe');
  });

  it('should return ClienteJaCadastradoErro if cliente with the same nome already exists', async () => {
    await cadastrarCliente.execute(input);
    const result = await cadastrarCliente.execute(input);
    const cliente = result.value.getErrorValue() as UseCaseError;

    expect(cliente.message).toBe('Cliente com nome John Doe já existe.');
  });

  it('should return InformacoesClienteInvalidasErro if cpf is invalid', async () => {
    const result = await cadastrarCliente.execute({
      ...input,
      cpf: '155.766.660-12',
    });

    const cliente = result.value.getErrorValue() as UseCaseError;

    expect(cliente.message).toBe('CPF inválido');
  });

  it('should return InformacoesClienteInvalidasErro if email is invalid', async () => {
    const result = await cadastrarCliente.execute({
      ...input,
      email: 'email@@email.com',
    });

    const cliente = result.value.getErrorValue() as UseCaseError;

    expect(cliente.message).toBe('Email inválido');
  });

  it.skip('should return UnexpectedError if an error occurs while saving the cliente', async () => {
    const result = await cadastrarCliente.execute(input);

    const cliente = result.value.getErrorValue() as UseCaseError;

    expect(cliente.message).toBe('UnexpectedError');
  });
});
