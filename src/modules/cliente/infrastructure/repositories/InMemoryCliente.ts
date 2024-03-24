import type Cliente from '@modules/cliente/domain/entities/Cliente';
import type IClienteRepository from '@modules/cliente/domain/repositories/IClienteRepository';

export default class InMemoryClienteRepository implements IClienteRepository {
  private readonly clientes: Cliente[] = [];

  async findByNome(nome: string): Promise<Cliente | undefined> {
    return this.clientes.find((cliente) => cliente.nome === nome);
  }

  async save(cliente: Cliente): Promise<any> {
    this.clientes.push(cliente);
  }
}
