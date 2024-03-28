import {
  left,
  Result,
  right,
  type Either,
} from '../../../../core/logic/Result';
import { type AppError } from '../../../../core/application/AppError';
import UniqueEntityId from '../../../../core/domain/entities/UniqueEntityId';
import type ITenantRepository from '../../../../modules/tenant/domain/repository/ITenantRepositry';
import type Tenant from '../../../../modules/tenant/domain/entities/Tenant';
import { TenantRepositoryErrors } from './tenantRepositoryErrors';

type Response = Either<AppError.UnexpectedError, Result<Tenant>>;
export default class InMemoryTenantRepository implements ITenantRepository {
  private readonly tenants: Tenant[] = [];

  async save(tenant: Tenant): Promise<any> {
    this.tenants.push(tenant);
  }

  async exists(t: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async delete(t: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<Response> {
    const tenantnData = this.tenants.find((tenant) =>
      tenant.id.equals(new UniqueEntityId(id)),
    );

    if (!tenantnData) {
      return left(new TenantRepositoryErrors.TenantNotExists());
    }

    return right(Result.ok<Tenant>(tenantnData));
  }

  async getByNome(nome: string): Promise<Response> {
    const tenantData = this.tenants.find((tenant) => tenant.nome === nome);

    if (!tenantData) {
      return left(new TenantRepositoryErrors.TenantNotExists());
    }

    return right(Result.ok<Tenant>(tenantData));
  }
}
