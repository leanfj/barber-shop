import { Result } from '../../../../core/logic/Result';
import { RepositoryError } from '../../../../core/domain/repositories/RepositoryError';

export namespace TenantRepositoryErrors {
  export class TenantNotExists extends Result<RepositoryError> {
    constructor() {
      super(false, new RepositoryError('The Tenant does not exist'));
    }
  }
}
