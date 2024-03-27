import { RepositoryError } from '../../../../core/domain/repositories/RepositoryError';
import { Result } from '../../../../core/logic/Result';

export namespace ClienteRepositoryErrors {
  export class ClienteNotExists extends Result<RepositoryError> {
    constructor() {
      super(false, new RepositoryError('Cliente não encontrado'));
    }
  }

  export class ClienteListEmpty extends Result<RepositoryError> {
    constructor() {
      super(false, new RepositoryError('Lista de clientes vazia'));
    }
  }
}
