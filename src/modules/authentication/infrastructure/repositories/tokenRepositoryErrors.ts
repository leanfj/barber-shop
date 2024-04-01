import { RepositoryError } from '../../../../core/domain/repositories/RepositoryError';
import { Result } from '../../../../core/logic/Result';

export namespace TokenRepositoryErrors {
  export class TokenNotExists extends Result<RepositoryError> {
    constructor() {
      super(false, new RepositoryError('Token not exists'));
    }
  }
}
