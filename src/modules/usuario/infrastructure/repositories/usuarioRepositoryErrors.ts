import { Result } from '../../../../core/logic/Result';
import { RepositoryError } from '../../../../core/domain/repositories/RepositoryError';

export namespace UsuarioRepositoryErrors {
  export class UsuarioNotExists extends Result<RepositoryError> {
    constructor() {
      super(false, new RepositoryError('The Usuario does not exist'));
    }
  }

  export class UsuarioListEmpty extends Result<RepositoryError> {
    constructor() {
      super(false, new RepositoryError('The list of Usuarios is empty'));
    }
  }
}
