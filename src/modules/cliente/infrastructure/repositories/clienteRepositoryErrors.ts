import { RepositoryError } from '../../../../core/domain/repositories/RepositoryError';
import { Result } from '../../../../core/logic/Result';

export namespace ClienteRepositoryErrors {
  export class ClienteNotExists extends Result<RepositoryError> {
    constructor() {
      super(false, new RepositoryError('Cliente não encontrado'));
    }
  }

  export class ClienteExists extends Result<RepositoryError> {
    constructor(nome: string) {
      super(false, new RepositoryError(`Cliente ${nome} já existe`));
    }
  }

  export class ClienteListEmpty extends Result<RepositoryError> {
    constructor() {
      super(false, new RepositoryError('Lista de clientes vazia'));
    }
  }
}
