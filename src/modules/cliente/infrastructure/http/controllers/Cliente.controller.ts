// import { ensureAuthenticated } from '../../../../../core/infrastructure/http/middlewares/ensureAuthenticated.middleware';
import { type ClienteService } from '../../../../../modules/cliente/application/Cliente.service';
import { CadastartClienteErrors } from '../../../../../modules/cliente/application/useCase/CadastrarCliente.errors';
import { IBaseController } from '../../../../../core/infrastructure/http/IBaseController';
import { type Request, type Response, Router } from 'express';
import { type CadastrarClienteInput } from 'modules/cliente/application/useCase/CadastrarCliente';
import { ensureAuthenticated } from '../../../../../core/infrastructure/http/middlewares/ensureAuthenticated.middleware';
import { ListarTodosClientesErrors } from '../../../../../modules/cliente/application/useCase/ListarTodosClientesUseCase.errors';
import { type IRequestWithUsuarioId } from '../../../../../core/infrastructure/http/IRequestWithUsuarioId';

export class ClienteController extends IBaseController {
  public path = '/clientes';
  public router = Router();

  constructor(private readonly clienteService: ClienteService) {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      ensureAuthenticated(),
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (request: Request, response: Response) => {
        return await this.create(request as IRequestWithUsuarioId, response);
      },
    );
    this.router.get(
      `${this.path}`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      ensureAuthenticated(),
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (request: Request, response: Response) => {
        return await this.getAll(request, response);
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

  async getAll(request: Request, response: Response): Promise<Response> {
    try {
      const { skip = '', take = '' } = request.query;

      const result = await this.clienteService.getAll({
        skip: (skip as string) ?? '',
        take: (take as string) ?? '',
      });
      if (result.isLeft()) {
        if (
          result.value instanceof ListarTodosClientesErrors.ClienteListEmpty
        ) {
          return this.notFound(response, result.value.getErrorValue().message);
        }
        return this.fail(response, result.value.getErrorValue().message);
      } else {
        const clienteList = result.value.getValue();
        return this.ok(response, clienteList);
      }
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return this.fail(response, err);
    }
  }

  async create(
    request: IRequestWithUsuarioId,
    response: Response,
  ): Promise<Response> {
    try {
      const body: CadastrarClienteInput = request.body;

      const result = await this.clienteService.create(body, request.usuarioId);

      if (result.isLeft()) {
        if (
          result.value instanceof CadastartClienteErrors.ClienteAlreadyExists
        ) {
          return this.conflict(response, result.value.getErrorValue().message);
        }
        if (result.value instanceof CadastartClienteErrors.InvalidData) {
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
