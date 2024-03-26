import type IRepository from '../../../../core/domain/repositories/IRepository';
import type Usuario from '../entities/Usuario';

export default interface IUsuarioRepository extends IRepository<Usuario> {
  findByEmail: (email: string) => Promise<Usuario | undefined>;
}
