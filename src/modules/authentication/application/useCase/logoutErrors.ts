import { UseCaseError } from '../../../../core/application/useCase/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace LogoutErrors {
  export class TokenNotExists extends Result<UseCaseError> {
    constructor() {
      super(false, new UseCaseError('Token não encontrado'));
    }
  }
}
