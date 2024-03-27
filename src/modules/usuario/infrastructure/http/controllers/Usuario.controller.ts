// import { ensureAuthenticated } from '../../../../../core/infrastructure/http/middlewares/ensureAuthenticated.middleware';
import { type UsuarioService } from '../../../../../modules/usuario/application/Usuario.service';
import { IBaseController } from '../../../../../core/infrastructure/http/IBaseController';
import { type Request, type Response, Router } from 'express';
import { type CadastraUsuarioInput } from '../../../../../modules/usuario/application/useCase/CadastraUsuario';
import { CadastraUsuarioErrors } from '../../../../../modules/usuario/application/useCase/CadastraUsuarioErrors';
import { type GetUsuarioByEmailInput } from '../../../../../modules/usuario/application/useCase/GetUsuarioByEmail';

export class UsuarioController extends IBaseController {
  public path = '/usuarios';
  public router = Router();

  constructor(private readonly usuarioService: UsuarioService) {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      // ensureAuthenticated(),
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (request: Request, response: Response) => {
        return await this.create(request, response);
      },
    );
    // this.router.get(
    //   `${this.path}`,
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //   ensureAuthenticated(),
    //   (request: Request, response: Response, next: NextFunction) => {
    //     this.getAll(request, response, next);
    //   },
    // );
    this.router.get(
      `${this.path}/email`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      // ensureAuthenticated(),
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (request: Request, response: Response) => {
        return await this.getByEmail(request, response);
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

  async create(request: Request, response: Response): Promise<Response> {
    try {
      const body: CadastraUsuarioInput = request.body;
      const result = await this.usuarioService.create(body);

      if (result.isLeft()) {
        if (
          result.value instanceof CadastraUsuarioErrors.UsuarioAlreadyExists
        ) {
          return this.conflict(response, result.value.getErrorValue().message);
        }
        if (result.value instanceof CadastraUsuarioErrors.InvalidData) {
          return this.invalidInput(
            response,
            result.value.getErrorValue().message,
          );
        }
        return this.fail(response, result.value.getErrorValue().message);
      }
      return this.created(response);
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return this.fail(response, err);
    }
  }

  async getByEmail(request: Request, response: Response): Promise<Response> {
    try {
      const body: GetUsuarioByEmailInput = {
        email: request.query.email as string,
      };
      const result = await this.usuarioService.getByEmail(body);

      if (result.isLeft()) {
        if (
          result.value instanceof CadastraUsuarioErrors.UsuarioAlreadyExists
        ) {
          return this.conflict(response, result.value.getErrorValue().message);
        }
        if (result.value instanceof CadastraUsuarioErrors.InvalidData) {
          return this.invalidInput(
            response,
            result.value.getErrorValue().message,
          );
        }
        return this.fail(response, result.value.getErrorValue().message);
      }
      return this.created(response);
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
