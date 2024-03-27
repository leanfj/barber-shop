import { ZodError } from 'zod';
import { CadastartClienteErrors } from './CadastrarCliente.errors';
import { AppError } from '../../../../core/application/AppError';
import { type IUseCase } from '../../../../core/application/useCase/IUseCase';
import CPF from '../../../../core/domain/valueObjects/CPF';
import Email from '../../../../core/domain/valueObjects/Email';
import {
  type Either,
  Result,
  left,
  right,
} from '../../../../core/logic/Result';
import Cliente from '../../../../modules/cliente/domain/entities/Cliente';
import type IClienteRepository from '../../../../modules/cliente/domain/repositories/IClienteRepository';

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
  Result<Cliente>
>;

export default class CadastrarCliente
  implements IUseCase<CadastrarClienteInput, Promise<CadastrarClienteOutput>>
{
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(input: CadastrarClienteInput): Promise<CadastrarClienteOutput> {
    try {
      const existingCliente = await this.clienteRepository.findByNome(
        input.nome,
      );

      if (!existingCliente.isLeft()) {
        return left(
          new CadastartClienteErrors.ClienteAlreadyExists(input.nome),
        );
      }

      const cliente = Cliente.create({
        tenantId: input.tenantId, // TODO - Pegar o valor de tenant
        nome: input.nome,
        email: Email.setValue(input.email),
        telefone: input.telefone,
        cpf: CPF.setValue(input.cpf),
        dataNascimento: input.dataNascimento,
        endereco: input.endereco,
        cidade: input.cidade,
        estado: input.estado,
        cep: input.cep,
        genero: input.genero,
        dataCadastro: input.dataCadastro,
        dataAtualizacao: input.dataAtualizacao,
      });

      await this.clienteRepository.save(cliente);

      return right(Result.ok<Cliente>(cliente));
    } catch (error) {
      if (error instanceof ZodError) {
        return left(new CadastartClienteErrors.InvalidData(error));
      }
      return left(new AppError.UnexpectedError(error));
    }
  }
}
