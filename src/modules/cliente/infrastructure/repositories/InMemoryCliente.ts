import type Cliente from '../../../../modules/cliente/domain/entities/Cliente';
import type IClienteRepository from '../../../../modules/cliente/domain/repositories/IClienteRepository';

export default class InMemoryClienteRepository implements IClienteRepository {
  private readonly clientes: Cliente[] = [];

  async findByNome(nome: string): Promise<Cliente | undefined> {
    return this.clientes.find((cliente) => cliente.nome === nome);
  }

  async save(cliente: Cliente): Promise<any> {
    this.clientes.push(cliente);
  }

  async exists(t: Cliente): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async delete(t: Cliente): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<Cliente> {
    throw new Error('Method not implemented.');
  }
}
