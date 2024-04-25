import Cliente from '../../../../modules/cliente/domain/entities/Cliente';
import prisma from '../../../../core/infrastructure/database/Prisma';
import type IClienteRepository from '../../../../modules/cliente/domain/repositories/IClienteRepository';
import Email from '../../../../core/domain/valueObjects/Email';
import { ClienteRepositoryErrors } from './clienteRepositoryErrors';
import {
  type Either,
  left,
  Result,
  right,
} from '../../../../core/logic/Result';
import { AppError } from '../../../../core/application/AppError';
import CPF from '../../../../core/domain/valueObjects/CPF';
import type ClienteToPersistenceDTO from '../../../../modules/cliente/application/dto/ClienteToPersistence.dto';
import ClienteToResponseDTO from '../../../../modules/cliente/application/dto/ClienteToResponse.dto';

// type Response = Either<
//   AppError.UnexpectedError,
//   Result<Cliente | Cliente[] | ClienteToResponseDTO>
// >;

export default class PrismaClienteRepository implements IClienteRepository {
  async getAll(
    skip: string,
    take: string,
  ): Promise<
    Either<
      AppError.UnexpectedError,
      Result<{
        total: number;
        data: Cliente[];
      }>
    >
  > {
    try {
      const totlalClientes = await prisma.cliente.count();

      let clienteData;

      if (skip && take) {
        clienteData = await prisma.cliente.findMany({
          skip: parseInt(skip),
          take: parseInt(take),
        });
      } else {
        clienteData = await prisma.cliente.findMany();
      }

      if (!clienteData.length) {
        return left(new ClienteRepositoryErrors.ClienteListEmpty());
      }

      const clientes = clienteData.map((cliente) => {
        return Cliente.create({
          tenantId: cliente.tenantId,
          nome: cliente.nome,
          email: cliente.email ? Email.setValue(cliente.email) : '',
          cpf: cliente.cpf ? CPF.setValue(cliente.cpf) : '',
          telefone: cliente.telefone,
          genero: cliente.genero ?? '',
          endereco: cliente.endereco ?? '',
          cidade: cliente.cidade ?? '',
          estado: cliente.estado ?? '',
          cep: cliente.cep ?? '',
          dataNascimento: cliente.dataNascimento ?? undefined,
          dataCadastro: cliente.dataCadastro,
          dataAtualizacao: cliente.dataAtualizacao,
        });
      });

      return right(
        Result.ok<{
          total: number;
          data: Cliente[];
        }>({
          total: totlalClientes,
          data: clientes,
        }),
      );
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }

  async save(
    cliente: ClienteToPersistenceDTO,
  ): Promise<Either<AppError.UnexpectedError, Result<ClienteToResponseDTO>>> {
    const clienteData = await prisma.cliente.create({
      data: {
        tenantId: cliente.tenantId,
        nome: cliente.nome,
        email: cliente.email,
        cpf: cliente.cpf,
        telefone: cliente.telefone,
        genero: cliente.genero,
        endereco: cliente.endereco,
        cidade: cliente.cidade,
        estado: cliente.estado,
        cep: cliente.cep,
        dataNascimento: cliente.dataNascimento,
        dataCadastro: cliente.dataCadastro,
        dataAtualizacao: cliente.dataAtualizacao,
      },
    });

    const clienteDTO = ClienteToResponseDTO.create({
      id: clienteData.id,
      tenantId: clienteData.tenantId,
      nome: clienteData.nome,
      email: clienteData.email ?? '',
      cpf: clienteData.cpf ?? '',
      telefone: clienteData.telefone,
      genero: clienteData.genero ?? '',
      endereco: clienteData.endereco ?? '',
      cidade: clienteData.cidade ?? '',
      estado: clienteData.estado ?? '',
      cep: clienteData.cep ?? '',
      dataNascimento: clienteData.dataNascimento ?? '',
      dataCadastro: clienteData.dataCadastro,
      dataAtualizacao: clienteData.dataAtualizacao,
    });

    return right(Result.ok<ClienteToResponseDTO>(clienteDTO));
  }

  async exists(t: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async findByEmail(email: string): Promise<Cliente> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<Cliente> {
    throw new Error('Method not implemented.');
  }

  async delete(cliente: ClienteToPersistenceDTO): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findByNome(
    nome: string,
  ): Promise<Either<AppError.UnexpectedError, Result<ClienteToResponseDTO>>> {
    const clienteData = await prisma.cliente.findFirst({
      where: {
        nome,
      },
    });

    if (!clienteData) {
      return left(new ClienteRepositoryErrors.ClienteNotExists());
    }

    const cliente = Cliente.create({
      tenantId: clienteData.tenantId,
      nome: clienteData.nome,
      email: clienteData.email ? Email.setValue(clienteData.email) : '',
      cpf: clienteData.cpf ? CPF.setValue(clienteData.cpf) : '',
      telefone: clienteData.telefone,
      genero: clienteData.genero ?? '',
      endereco: clienteData.endereco ?? '',
      cidade: clienteData.cidade ?? '',
      estado: clienteData.estado ?? '',
      cep: clienteData.cep ?? '',
      dataNascimento: clienteData.dataNascimento ?? undefined,
      dataCadastro: clienteData.dataCadastro,
      dataAtualizacao: clienteData.dataAtualizacao,
    });

    const clienteDTO = ClienteToResponseDTO.create({
      id: cliente.id.toString(),
      tenantId: cliente.tenantId,
      nome: cliente.nome,
      email: cliente.email ?? '',
      cpf: cliente.cpf ?? '',
      telefone: cliente.telefone ?? '',
      genero: cliente.genero ?? '',
      endereco: cliente.endereco ?? '',
      cidade: cliente.cidade ?? '',
      estado: cliente.estado ?? '',
      cep: cliente.cep ?? '',
      dataNascimento: cliente.dataNascimento ?? '',
      dataCadastro: cliente.dataCadastro ?? new Date(),
      dataAtualizacao: cliente.dataAtualizacao ?? new Date(),
    });

    return right(Result.ok<ClienteToResponseDTO>(clienteDTO));
  }

  async getById(
    id: string,
  ): Promise<Either<AppError.UnexpectedError, Result<ClienteToResponseDTO>>> {
    throw new Error('Method not implemented.');
  }
}
