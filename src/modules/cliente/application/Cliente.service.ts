import type IClienteRepository from '../domain/repositories/IClienteRepository';
import CadastrarCliente, {
  type CadastrarClienteInput,
} from './useCase/CadastrarCliente';
import type Cliente from '../domain/entities/Cliente';
import { AppError } from '../../../core/application/AppError';
import { type Either, Result, left, right } from '../../../core/logic/Result';
import ListarTodosClientes from './useCase/ListarTodosClientes.usecase';
import { type TenantService } from '../../../modules/tenant/application/tenant.service';
import ClienteToResponseDTO from './dto/ClienteToResponse.dto';

// type Response = Either<AppError.UnexpectedError, Result<Cliente[] | Cliente>>;

export class ClienteService {
  private readonly CadastratClienteUseCase: CadastrarCliente;
  private readonly ListarTodosClientesUseCase: ListarTodosClientes;

  private readonly tenantService: TenantService;

  constructor(
    readonly clienteRepository: IClienteRepository,
    tenantService: TenantService,
  ) {
    this.CadastratClienteUseCase = new CadastrarCliente(clienteRepository);
    this.ListarTodosClientesUseCase = new ListarTodosClientes(
      clienteRepository,
    );

    this.tenantService = tenantService;
  }

  public async getAll(input: { skip: string; take: string }): Promise<
    Either<
      AppError.UnexpectedError,
      Result<{
        total: number;
        data: ClienteToResponseDTO[];
      }>
    >
  > {
    try {
      const result = await this.ListarTodosClientesUseCase.execute(input);

      if (result.isLeft()) {
        return left(result.value);
      }

      const clienteResponse = result.value
        .getValue()
        .data.map((cliente: Cliente) => {
          return ClienteToResponseDTO.create({
            id: cliente.id.toValue(),
            tenantId: cliente.tenantId,
            nome: cliente.nome,
            email: cliente.email ?? '',
            telefone: cliente.telefone ?? '',
            cpf: cliente.cpf ?? '',
            dataNascimento: cliente.dataNascimento
              ? new Date(cliente.dataNascimento.toISOString())
              : new Date(),
            endereco: cliente.endereco ?? '',
            cidade: cliente.cidade ?? '',
            estado: cliente.estado ?? '',
            cep: cliente.cep ?? '',
            genero: cliente.genero ?? '',
            dataCadastro: cliente.dataCadastro
              ? new Date(cliente.dataCadastro.toISOString())
              : new Date(),
            dataAtualizacao: cliente.dataAtualizacao
              ? new Date(cliente.dataAtualizacao.toISOString())
              : new Date(),
          });
        });

      return right(
        Result.ok<{
          total: number;
          data: ClienteToResponseDTO[];
        }>({
          total: result.value.getValue().total,
          data: clienteResponse,
        }),
      );
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  public async create(
    cliente: CadastrarClienteInput,
    usuarioId: string,
  ): Promise<Either<AppError.UnexpectedError, Result<ClienteToResponseDTO>>> {
    try {
      const tenantData =
        await this.tenantService.getTenantByUsuarioId(usuarioId);

      if (tenantData.isLeft()) {
        return left(tenantData.value);
      }

      const result = await this.CadastratClienteUseCase.execute({
        cadastrarClienteInput: cliente,
        tenant: tenantData.value.getValue(),
      });

      if (result.isLeft()) {
        return left(result.value);
      }

      const clienteToResponse = ClienteToResponseDTO.create({
        id: result.value.getValue().id.toString(),
        tenantId: result.value.getValue().tenantId,
        nome: result.value.getValue().nome,
        email: result.value.getValue().email ?? '',
        telefone: result.value.getValue().telefone ?? '',
        cpf: result.value.getValue().cpf ?? '',
        dataNascimento: result.value.getValue().dataNascimento ?? '',
        endereco: result.value.getValue().endereco ?? '',
        cidade: result.value.getValue().cidade ?? '',
        estado: result.value.getValue().estado ?? '',
        cep: result.value.getValue().cep ?? '',
        genero: result.value.getValue().genero ?? '',
        dataCadastro: result.value.getValue().dataCadastro ?? new Date(),
        dataAtualizacao: result.value.getValue().dataAtualizacao ?? new Date(),
      });

      return right(Result.ok<ClienteToResponseDTO>(clienteToResponse));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
