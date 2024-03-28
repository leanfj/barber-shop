import {
  left,
  Result,
  right,
  type Either,
} from '../../../../core/logic/Result';
import { AppError } from '../../../../core/application/AppError';
import { type IUseCase } from '../../../../core/application/useCase/IUseCase';
import Tenant from '../../../../modules/tenant/domain/entities/Tenant';
import type ITenantRepository from '../../../../modules/tenant/domain/repository/ITenantRepositry';
import { CadastraTenantErrors } from './CadastraTenantError';
import Slug from '../../../../core/domain/valueObjects/Slug';

export interface CadastraTenantInput {
  nome: string;
  slug: string;
  isAtivo: boolean;
  dataCadastro: Date;
  dataAtualizacao: Date;
}

export type CadastrarTenantOutput = Either<
  AppError.UnexpectedError,
  Result<Tenant>
>;

export class CadastraTenant
  implements IUseCase<CadastraTenantInput, Promise<CadastrarTenantOutput>>
{
  constructor(private readonly tenantRepository: ITenantRepository) {}

  async execute(input: CadastraTenantInput): Promise<CadastrarTenantOutput> {
    try {
      const tenantExits = await this.tenantRepository.getByNome(input.nome);

      if (!tenantExits.isLeft()) {
        return left(new CadastraTenantErrors.TenantAlreadyExists());
      }

      const tenant = Tenant.create({
        nome: input.nome,
        slug: Slug.setValue(input.slug),
        isAtivo: input.isAtivo,
        dataCadastro: new Date(),
        dataAtualizacao: new Date(),
      });

      await this.tenantRepository.save(tenant);

      return right(Result.ok<Tenant>(tenant));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
