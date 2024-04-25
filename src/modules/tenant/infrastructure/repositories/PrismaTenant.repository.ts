import {
  left,
  Result,
  right,
  type Either,
} from '../../../../core/logic/Result';
import { type AppError } from '../../../../core/application/AppError';
import UniqueEntityId from '../../../../core/domain/entities/UniqueEntityId';
import type ITenantRepository from '../../domain/repository/ITenantRepositry';
import Tenant from '../../domain/entities/Tenant';
import { TenantRepositoryErrors } from './tenantRepositoryErrors';
import prisma from '../../../../core/infrastructure/database/Prisma';
import Slug from '../../../../core/domain/valueObjects/Slug';

type Response = Either<AppError.UnexpectedError, Result<Tenant>>;
export default class PrismaTenantRepository implements ITenantRepository {
  async save(tenant: Tenant): Promise<Response> {
    const tenantData = await prisma.tenant.create({
      data: {
        id: tenant.id.toString(),
        nome: tenant.nome,
        isAtivo: tenant.isAtivo,
        dataAtualizacao: tenant.dataAtualizacao,
        dataCadastro: tenant.dataCadastro,
        slug: tenant.slug ?? Slug.setValue(tenant.nome).getValue(),
      },
    });

    const tenantToApplication = Tenant.create(
      {
        nome: tenantData.nome,
        isAtivo: tenantData.isAtivo,
        dataAtualizacao: tenantData.dataAtualizacao,
        dataCadastro: tenantData.dataCadastro,
        slug: Slug.setValue(tenantData.nome),
      },
      new UniqueEntityId(tenantData.id),
    );

    return right(Result.ok<Tenant>(tenantToApplication));
  }

  async exists(t: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async delete(tenant: Tenant): Promise<any> {
    await prisma.tenant.delete({
      where: {
        id: tenant.id.toValue(),
      },
    });
  }

  async getById(id: string): Promise<Response> {
    const tenantData = await prisma.tenant.findFirst({
      where: {
        id,
      },
    });

    if (!tenantData) {
      return left(new TenantRepositoryErrors.TenantNotExists());
    }

    const tenantToApplication = Tenant.create(
      {
        nome: tenantData.nome,
        isAtivo: tenantData.isAtivo,
        dataAtualizacao: tenantData.dataAtualizacao,
        dataCadastro: tenantData.dataCadastro,
        slug: Slug.setValue(tenantData.nome),
      },
      new UniqueEntityId(tenantData.id),
    );

    return right(Result.ok<Tenant>(tenantToApplication));
  }

  async getByNome(nome: string): Promise<Response> {
    const tenantData = await prisma.tenant.findFirst({
      where: {
        nome,
      },
    });

    if (!tenantData) {
      return left(new TenantRepositoryErrors.TenantNotExists());
    }

    const tenantToApplication = Tenant.create(
      {
        nome: tenantData.nome,
        isAtivo: tenantData.isAtivo,
        dataAtualizacao: tenantData.dataAtualizacao,
        dataCadastro: tenantData.dataCadastro,
        slug: Slug.setValue(tenantData.nome),
      },
      new UniqueEntityId(tenantData.id),
    );

    return right(Result.ok<Tenant>(tenantToApplication));
  }

  async findByUsuarioId(usuarioId: string): Promise<Response> {
    const tenantData = await prisma.tenant.findFirst({
      where: {
        usuarios: {
          some: {
            id: usuarioId,
          },
        },
      },
    });

    if (!tenantData) {
      return left(new TenantRepositoryErrors.TenantNotExists());
    }

    const tenantToApplication = Tenant.create(
      {
        nome: tenantData.nome,
        isAtivo: tenantData.isAtivo,
        dataAtualizacao: tenantData.dataAtualizacao,
        dataCadastro: tenantData.dataCadastro,
        slug: Slug.setValue(tenantData.nome),
      },
      new UniqueEntityId(tenantData.id),
    );

    return right(Result.ok<Tenant>(tenantToApplication));
  }
}
