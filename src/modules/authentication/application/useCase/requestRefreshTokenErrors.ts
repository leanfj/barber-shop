import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/application/useCase/UseCaseError';

export namespace RequestRefreshTokenErrors {
  export class TokenInvalid extends Result<UseCaseError> {
    constructor() {
      super(false, new UseCaseError('Token inválido'));
    }
  }
}
