import UniqueEntityId from '../../../../../src/core/domain/entities/UniqueEntityId';
import Tenant from '../../../../../src/modules/tenant/domain/entities/Tenant';

describe('Tenant', () => {
  it('should create a new Tenant', () => {
    const tenantData = {
      nome: 'Example Tenant',
      isAtivo: true,
      dataCadastro: new Date(),
      dataAtualizacao: new Date(),
    };

    const tenantId = new UniqueEntityId();
    const tenant = new Tenant(tenantData, tenantId);

    expect(tenant).toBeInstanceOf(Tenant);
    expect(tenant.id).toBe(tenantId);
    expect(tenant.nome).toBe('Example Tenant');
    expect(tenant.isAtivo).toBe(true);
    expect(tenant.dataCadastro).toEqual(tenantData.dataCadastro);
    expect(tenant.dataAtualizacao).toEqual(tenantData.dataAtualizacao);
    expect(tenant.slug).toBe('example_tenant');
  });

  it('should activate the tenant', () => {
    const tenantData = {
      nome: 'Example Tenant',
      isAtivo: false,
      dataCadastro: new Date(),
      dataAtualizacao: new Date(),
    };

    const tenantId = new UniqueEntityId();
    const tenant = new Tenant(tenantData, tenantId);

    tenant.ativar();

    expect(tenant.isAtivo).toBe(true);
  });

  it('should deactivate the tenant', () => {
    const tenantData = {
      nome: 'Example Tenant',
      isAtivo: true,
      dataCadastro: new Date(),
      dataAtualizacao: new Date(),
    };

    const tenantId = new UniqueEntityId();
    const tenant = new Tenant(tenantData, tenantId);

    tenant.desativar();

    expect(tenant.isAtivo).toBe(false);
  });

  it('should create a tenant without an ID', () => {
    const tenantData = {
      nome: 'Example Tenant',
      isAtivo: true,
      dataCadastro: new Date(),
      dataAtualizacao: new Date(),
    };

    const tenant = Tenant.create(tenantData);

    expect(tenant).toBeInstanceOf(Tenant);
    expect(tenant.id).toBeInstanceOf(UniqueEntityId);
    expect(tenant.nome).toBe('Example Tenant');
    expect(tenant.isAtivo).toBe(true);
    expect(tenant.dataCadastro).toEqual(tenantData.dataCadastro);
    expect(tenant.dataAtualizacao).toEqual(tenantData.dataAtualizacao);
  });
});
