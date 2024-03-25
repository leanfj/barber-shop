import { type Response, type NextFunction } from 'express';
import { type IDataStoredInToken } from '../IDataStoreInToken';
import { type IRequestWithUsuarioId } from '../IRequestWithUsuarioId';
import { verify } from 'jsonwebtoken';
import { AuthenticationTokenMissingException } from '../../../../modules/authentication/http/exceptions/authenticationTokenMissing.excepition';
import { WrongAuthenticationTokenException } from '../../../../modules/authentication/http/exceptions/wrongAuthenticationToken.exception';

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
          throw new Error('Internal server error');
        }
        const token = authToken.split(' ')[1];
        const decoded = verify(token, secret) as unknown as IDataStoredInToken;

        if (decoded == null) {
          return response
            .status(403)
            .send({ message: 'Token signature expired.' });
        }
        request.usuarioId = decoded.id;
      } catch (error) {
        next(new WrongAuthenticationTokenException());
      }
      next();
    } else {
      next(new AuthenticationTokenMissingException());
    }
  };
}
