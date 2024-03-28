import { UseCaseError } from '../../../../core/application/useCase/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace LoginErrors {
  export class PasswordOrEmailIncorrect extends Result<UseCaseError> {
    constructor() {
      super(false, new UseCaseError('Email ou senha incorretos'));
    }
  }
}
