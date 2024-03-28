import { type Either, left, Result, right } from '../../../core/logic/Result';
import { AppError } from '../../../core/application/AppError';
import type Tenant from '../domain/entities/Tenant';
import {
  CadastraTenant,
  type CadastraTenantInput,
} from './useCase/CadastraTenant';
import type ITenantRepository from '../domain/repository/ITenantRepositry';

type Response = Either<AppError.UnexpectedError, Result<Tenant>>;

export class TenantService {
  private readonly cadastraTenant: CadastraTenant;

  constructor(readonly tenantRepository: ITenantRepository) {
    this.cadastraTenant = new CadastraTenant(tenantRepository);
  }

  public async create(input: CadastraTenantInput): Promise<Response> {
    try {
      const result = await this.cadastraTenant.execute(input);
      if (result.isLeft()) {
        return left(result.value);
      } else {
        return right(Result.ok<Tenant>(result.value.getValue()));
      }
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
