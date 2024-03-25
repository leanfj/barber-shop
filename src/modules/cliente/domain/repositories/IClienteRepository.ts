import type IRepository from '../../../../core/domain/repositories/IRepository';
import type Cliente from '../entities/Cliente';

export default interface IClienteRepository extends IRepository<Cliente> {
  findByNome: (nome: string) => Promise<Cliente | undefined>;
}
