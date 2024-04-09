import { type Request, type Response, Router } from 'express';
import { IBaseController } from '../../../../../core/infrastructure/http/IBaseController';
import { ensureAuthenticated } from '../../../../../core/infrastructure/http/middlewares/ensureAuthenticated.middleware';
import { type LoginInput } from '../../../application/useCase/login.useCase';
import { LoginErrors } from '../../../application/useCase/loginErrors';
import { type AuthenticationService } from '../../../application/authentication.service';
import { RequestRefreshTokenErrors } from '../../../../../modules/authentication/application/useCase/requestRefreshTokenErrors';

export class AuthenticationController extends IBaseController {
  public path = '/authentication';
  public router = Router();

  constructor(private readonly authenticationService: AuthenticationService) {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/login`,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (request: Request, response: Response) => {
        return await this.login(request, response);
      },
    );

    this.router.post(
      `${this.path}/logout`,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (request: Request, response: Response) => {
        return await this.logout(request, response);
      },
    );

    this.router.post(
      `${this.path}/resetPassword`,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (request: Request, response: Response) => {
        return await this.requestResetPassword(request, response);
      },
    );

    this.router.post(
      `${this.path}/refreshToken`,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (request: Request, response: Response) => {
        return await this.requestRefreshToken(request, response);
      },
    );

    this.router.patch(
      `${this.path}/changePassword`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      ensureAuthenticated(),
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (request: Request, response: Response) => {
        return await this.changePassword(request, response);
      },
    );

    // this.router.delete(
    //   `${this.path}/:id`,
    //   (request: Request, response: Response, next: NextFunction) =>
    //     this.delete(request, response, next)
    // );
    // this.router.get(
    //   `${this.path}/DocEntry/:docEntry`,
    //   (request: Request, response: Response, next: NextFunction) =>
    //     this.getPurchaseOrdersDocEntry(request, response, next)
    // );
    // this.router
    //   .all(`${this.path}/*`, authMiddleware)
    //   .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
    //   .delete(`${this.path}/:id`, this.deletePost)
    //   .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost)
  }
  //   getAll(request: Request, response: Response, next: NextFunction): void {
  //     throw new Error('Method not implemented.');
  //   }

  //   async getAll(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const result = await this.clienteService.getAll();
  //       if (result.isLeft()) {
  //         if (result.value instanceof GetAllClienteErrors.ClienteListEmpty) {
  //           return this.notFound(res, result.value.getErrorValue().message);
  //         }
  //         return this.fail(res, result.value.getErrorValue().message);
  //       } else {
  //         const clienteList = result.value.getValue();
  //         return this.ok(res, clienteList);
  //       }
  //     } catch (err) {
  //       return this.fail(res, err);
  //     }
  //   }

  async login(request: Request, response: Response): Promise<Response> {
    try {
      const body: LoginInput = request.body;

      const result = await this.authenticationService.login(body);

      if (result.isLeft()) {
        if (result.value instanceof LoginErrors.PasswordOrEmailIncorrect) {
          return this.unauthorized(
            response,
            result.value.getErrorValue().message,
          );
        }
        return this.fail(response, result.value.getErrorValue().message);
      }

      const { token, refreshToken } = result.value.getValue();

      // const serializedRefreshToken = serialize('refreshToken', refreshToken, {
      //   httpOnly: true,
      //   path: '/',
      //   secure: process.env.NODE_ENV === 'production',
      //   maxAge: 60 * 60 * 24 * 30,
      // });

      // const serializedToken = serialize('token', token.token, {
      //   httpOnly: true,
      //   path: '/',
      //   secure: process.env.NODE_ENV === 'production',
      //   maxAge: 60 * 60 * 24 * 30,
      // });

      // response.setHeader('Set-Cookie', serializedToken);
      // response.setHeader('Set-Cookie', serializedRefreshToken);

      response.cookie('token', token.token, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
      });
      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
      });

      return this.ok(response, { token, refreshToken });
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return this.fail(response, err);
    }
  }

  async logout(request: Request, response: Response): Promise<Response> {
    try {
      const body: { email: string } = request.body;

      const result = await this.authenticationService.logout(body.email);

      if (result.isLeft()) {
        if (result.value instanceof LoginErrors.UserNotFoundEmail) {
          return this.unauthorized(
            response,
            result.value.getErrorValue().message,
          );
        }
        return this.fail(response, result.value.getErrorValue().message);
      }

      response.cookie('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: -1,
        path: '/',
      });

      response.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: -1,
        path: '/',
      });

      return this.ok(response, result.value.getValue());
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return this.fail(response, err);
    }
  }

  async requestResetPassword(
    request: Request,
    response: Response,
  ): Promise<Response> {
    try {
      const body: LoginInput = request.body;

      const result = await this.authenticationService.requestResetPassword(
        body.email,
      );

      if (result.isLeft()) {
        if (result.value instanceof LoginErrors.UserNotFoundEmail) {
          return this.ok(response, result.value.getErrorValue().message);
        }
        return this.fail(response, result.value.getErrorValue().message);
      }
      return this.ok(response, result.value.getValue());
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return this.fail(response, err);
    }
  }

  async requestRefreshToken(
    request: Request,
    response: Response,
  ): Promise<Response> {
    try {
      const body: {
        refreshToken: string;
        email: string;
      } = request.body;

      const result = await this.authenticationService.requestRefreshToken(
        body.refreshToken,
        body.email,
      );

      if (result.isLeft()) {
        if (
          result.value instanceof RequestRefreshTokenErrors.TokenInvalid ||
          result.value instanceof LoginErrors.UserNotFound
        ) {
          return this.ok(response, result.value.getErrorValue().message);
        }
        return this.fail(response, result.value.getErrorValue().message);
      }
      return this.ok(response, result.value.getValue());
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return this.fail(response, err);
    }
  }

  async changePassword(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const usuarioId = request.query.usuarioId as string;
    const password = request.body.password as string;
    const resetPasswordToken = request.query.resetPasswordToken as string;

    try {
      const result = await this.authenticationService.resetPassword(
        usuarioId,
        resetPasswordToken,
        password,
      );

      if (result.isLeft()) {
        if (result.value instanceof LoginErrors.UserNotFoundEmail) {
          return this.ok(response, result.value.getErrorValue().message);
        }
        return this.fail(response, result.value.getErrorValue().message);
      }
      return this.ok(response, result.value.getValue());
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return this.fail(response, err);
    }
  }

  //   async delete(request: Request, response: Response, next: NextFunction) {
  //     const id = request.params.id;
  //     try {
  //       const result = await this.clienteService.delete(new UniqueEntityID(id));
  //       if (result.isLeft()) {
  //         if (result.value instanceof DeleteClienteErrors.ClienteNotExists) {
  //           return this.notFound(response, result.value.getErrorValue().message);
  //         }
  //         return this.fail(response, result.value.getErrorValue().message);
  //       } else {
  //         return this.ok(response, null);
  //       }
  //     } catch (err) {
  //       return this.fail(response, err);
  //     }
  //   }
}
