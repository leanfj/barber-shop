import { type ZodError } from 'zod';
import { UseCaseError } from '../../../../core/application/useCase/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace CadastraTenantErrors {
  export class TenantAlreadyExists extends Result<UseCaseError> {
    constructor() {
      super(false, new UseCaseError(`Tenant já existe.`));
    }
  }

  export class InvalidData extends Result<UseCaseError> {
    constructor(data: ZodError) {
      super(
        false,
        new UseCaseError(data.issues.map((issue) => issue.message).join(', ')),
      );
    }
  }
}
