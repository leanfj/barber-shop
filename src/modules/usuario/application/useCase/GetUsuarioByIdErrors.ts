import { UseCaseError } from '../../../../core/application/useCase/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace GetUsuarioByIdErrors {
  export class UsuarioNotExists extends Result<UseCaseError> {
    constructor() {
      super(false, new UseCaseError('Usuario não encontrado'));
    }
  }
}
