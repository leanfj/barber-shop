import type Cliente from '../entities/Cliente';

export default interface IClienteRepository {
  save: (cliente: Cliente) => Promise<any>;
  findByNome: (nome: string) => Promise<Cliente | undefined>;
}
