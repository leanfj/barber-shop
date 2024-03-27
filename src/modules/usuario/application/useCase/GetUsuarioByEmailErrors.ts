import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/application/useCase/UseCaseError';
import { type ZodError } from 'zod';

export namespace GetUsuarioByEmailErrors {
  export class UsuarioNotExists extends Result<UseCaseError> {
    constructor() {
      super(false, new UseCaseError('Usuário não encontrado.'));
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
