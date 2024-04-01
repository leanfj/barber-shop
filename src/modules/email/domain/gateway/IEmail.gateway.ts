import { type AppError } from '../../../../core/application/AppError';
import { type Either, type Result } from '../../../../core/logic/Result';

type Response = Either<AppError.UnexpectedError, Result<void>>;

export interface IEmailGateway {
  send: (
    email: string,
    subject: string,
    payload: { nome: string; link?: string },
    template: string,
  ) => Promise<Response>;
}
