import { type UseCaseError } from '../../../../core/application/useCase/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace ListarTodosClientesErrors {
  export class ClienteListEmpty extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'Lista de clientes vazia',
      });
    }
  }
}
