import { IBaseController } from '../../../../../core/infrastructure/http/IBaseController';
import { type Request, type Response, Router } from 'express';

import { type LoginInput } from '../../../../../modules/authentication/application/useCase/login.useCase';
import { type LoginService } from '../../../../../modules/authentication/application/login.service';
import { type UsuarioService } from '../../../../../modules/usuario/application/Usuario.service';
import { LoginErrors } from '../../../../../modules/authentication/application/useCase/loginErrors';

export class LoginController extends IBaseController {
  public path = '/authentication';
  public router = Router();

  constructor(
    private readonly loginService: LoginService,
    private readonly usuarioService: UsuarioService,
  ) {
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

    // this.router.patch(
    //   `${this.path}/:id`,
    //   (request: Request, response: Response, next: NextFunction) =>
    //     this.update(request, response, next)
    // );

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

      const result = await this.loginService.login(body);

      if (result.isLeft()) {
        if (result.value instanceof LoginErrors.PasswordOrEmailIncorrect) {
          return this.unauthorized(
            response,
            result.value.getErrorValue().message,
          );
        }
        return this.fail(response, result.value.getErrorValue().message);
      }
      return this.ok(response, result.value.getValue());
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return this.fail(response, err);
    }
  }

  //   async update(request: Request, response: Response, next: NextFunction) {
  //     const cliente = JSON.parse(decodeURIComponent(request.body));
  //     const id = request.params.id;
  //     try {
  //       const result = await this.clienteService.update(
  //         cliente,
  //         new UniqueEntityID(id)
  //       );
  //       if (result.isLeft()) {
  //         if (result.value instanceof UpdateClienteErrors.ClienteNotExists) {
  //           return this.notFound(response, result.value.getErrorValue().message);
  //         }
  //         return this.fail(response, result.value.getErrorValue().message);
  //       } else {
  //         return this.ok(response, cliente);
  //       }
  //     } catch (err) {
  //       return this.fail(response, err);
  //     }
  //   }

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
