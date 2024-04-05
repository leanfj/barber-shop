import { type Response, type NextFunction } from 'express';
import { TokenExpiredError, verify } from 'jsonwebtoken';
import { type IDataStoredInToken } from '../IDataStoreInToken';
import { type IRequestWithUsuarioId } from '../IRequestWithUsuarioId';
import { AuthenticationTokenMissingException } from '../../../../modules/authentication/infrastructure/http/exceptions/authenticationTokenMissing.excepition';
import { WrongAuthenticationTokenException } from '../../../../modules/authentication/infrastructure/http/exceptions/wrongAuthenticationToken.exception';
import { TimeoutAuthenticationTokenException } from '../../../../modules/authentication/infrastructure/http/exceptions/timeoutAuthenticationToken.exception';

export function ensureAuthenticated(): any {
  return (
    request: IRequestWithUsuarioId,
    response: Response,
    next: NextFunction,
  ) => {
    const authToken: string = request.cookies.token;
    try {
      if (authToken != null) {
        const secret = process.env.JWT_SECRET;

        if (secret == null) {
          throw new Error('Erro interno do servidor.');
        }
        const decoded = verify(
          authToken,
          secret,
        ) as unknown as IDataStoredInToken;
        request.usuarioId = decoded.id;
      } else {
        next(new AuthenticationTokenMissingException());
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        next(new TimeoutAuthenticationTokenException());
      } else {
        next(new WrongAuthenticationTokenException());
      }
    }
    next();
  };
}
