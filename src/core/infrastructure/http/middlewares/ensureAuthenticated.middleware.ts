import { type Response, type NextFunction } from 'express';
import { type IDataStoredInToken } from '../IDataStoreInToken';
import { type IRequestWithUsuarioId } from '../IRequestWithUsuarioId';
import { TokenExpiredError, verify } from 'jsonwebtoken';
import { AuthenticationTokenMissingException } from '../../../../modules/authentication/http/exceptions/authenticationTokenMissing.excepition';
import { WrongAuthenticationTokenException } from '../../../../modules/authentication/http/exceptions/wrongAuthenticationToken.exception';
import { TimeoutAuthenticationTokenException } from '../../../../modules/authentication/http/exceptions/timeoutAuthenticationToken.exception';

export function ensureAuthenticated(): any {
  return (
    request: IRequestWithUsuarioId,
    response: Response,
    next: NextFunction,
  ) => {
    const authToken = request.headers.authorization;

    if (authToken != null) {
      const secret = process.env.JWT_SECRET;

      try {
        if (secret == null) {
          throw new Error('Erro interno do servidor.');
        }
        const token = authToken.split(' ')[1];
        const decoded = verify(token, secret) as unknown as IDataStoredInToken;
        request.usuarioId = decoded.id;
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          next(new TimeoutAuthenticationTokenException());
        }
        next(new WrongAuthenticationTokenException());
      }
      next();
    } else {
      next(new AuthenticationTokenMissingException());
    }
  };
}
