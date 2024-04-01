import { UseCaseError } from '../../../../core/application/useCase/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace TokenErrors {
  export class TokenInvalid extends Result<UseCaseError> {
    constructor() {
      super(false, new UseCaseError('Token inválido'));
    }
  }
}
