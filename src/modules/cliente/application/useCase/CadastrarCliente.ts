import { ZodError } from 'zod';
import { CadastartClienteErrors } from './CadastrarCliente.errors';
import { AppError } from '../../../../core/application/AppError';
import { type IUseCase } from '../../../../core/application/useCase/IUseCase';
import {
  type Either,
  Result,
  left,
  right,
} from '../../../../core/logic/Result';
import type IClienteRepository from '../../../../modules/cliente/domain/repositories/IClienteRepository';
import type Tenant from '../../../../modules/tenant/domain/entities/Tenant';
import ClienteToPersistenceDTO from '../dto/ClienteToPersistence.dto';
import type Cliente from '../../../../modules/cliente/domain/entities/Cliente';
import type ClienteToResponseDTO from '../dto/ClienteToResponse.dto';

export interface CadastrarClienteInput {
  tenantId: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: Date;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  genero: string;
  dataCadastro: Date;
  dataAtualizacao: Date;
}

export type CadastrarClienteOutput = Either<
  AppError.UnexpectedError,
  Result<Cliente | ClienteToResponseDTO>
>;

export default class CadastrarCliente
  implements
    IUseCase<
      { cadastrarClienteInput: CadastrarClienteInput; tenant: Tenant },
      Promise<CadastrarClienteOutput>
    >
{
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(input: {
    cadastrarClienteInput: CadastrarClienteInput;
    tenant: Tenant;
  }): Promise<Either<AppError.UnexpectedError, Result<ClienteToResponseDTO>>> {
    try {
      const existingCliente = await this.clienteRepository.findByNome(
        input.cadastrarClienteInput.nome,
      );

      if (!existingCliente.isLeft()) {
        return left(
          new CadastartClienteErrors.ClienteAlreadyExists(
            input.cadastrarClienteInput.nome,
          ),
        );
      }

      const cliente = await this.clienteRepository.save(
        ClienteToPersistenceDTO.create({
          tenantId: input.tenant.id.toValue(),
          nome: input.cadastrarClienteInput.nome,
          email: input.cadastrarClienteInput.email,
          cpf: input.cadastrarClienteInput.cpf,
          telefone: input.cadastrarClienteInput.telefone,
          genero: input.cadastrarClienteInput.genero,
          endereco: input.cadastrarClienteInput.endereco,
          cidade: input.cadastrarClienteInput.cidade,
          estado: input.cadastrarClienteInput.estado,
          cep: input.cadastrarClienteInput.cep,
          dataNascimento: input.cadastrarClienteInput.dataNascimento,
          dataCadastro: input.cadastrarClienteInput.dataCadastro,
          dataAtualizacao: input.cadastrarClienteInput.dataAtualizacao,
        }),
      );

      if (cliente.isLeft()) {
        return left(cliente.value);
      }

      return right(Result.ok<ClienteToResponseDTO>(cliente.value.getValue()));
    } catch (error) {
      if (error instanceof ZodError) {
        return left(new CadastartClienteErrors.InvalidData(error));
      }
      return left(new AppError.UnexpectedError(error));
    }
  }
}
