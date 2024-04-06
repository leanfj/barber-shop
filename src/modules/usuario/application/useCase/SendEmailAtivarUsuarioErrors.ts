import { type ZodError } from 'zod';
import { UseCaseError } from '../../../../core/application/useCase/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace SendEmailAtivarUsuarioUseCaseErrors {
  export class UsuarioNaoEncontrado extends Result<UseCaseError> {
    constructor(email: string) {
      super(
        false,
        new UseCaseError(`Usuario com email ${email} não foi encontrado.`),
      );
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
