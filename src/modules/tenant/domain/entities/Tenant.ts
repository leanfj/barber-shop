import type Slug from '../../../../core/domain/valueObjects/Slug';
import Entity from '../../../../core/domain/entities/Entity';
import type UniqueEntityId from '../../../../core/domain/entities/UniqueEntityId';

interface TenantProps {
  id?: string;
  nome: string;
  slug?: Slug;
  isAtivo: boolean;
  dataCadastro?: Date;
  dataAtualizacao?: Date;
}

export default class Tenant extends Entity<TenantProps> {
  constructor(props: TenantProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  get nome(): string {
    return this.props.nome;
  }

  get slug(): string | undefined {
    return this.props.slug?.getValue();
  }

  get isAtivo(): boolean {
    return this.props.isAtivo;
  }

  get dataCadastro(): Date | undefined {
    return this.props.dataCadastro;
  }

  get dataAtualizacao(): Date | undefined {
    return this.props.dataAtualizacao;
  }

  public ativar(): void {
    this.props.isAtivo = true;
  }

  public desativar(): void {
    this.props.isAtivo = false;
  }

  static create(props: TenantProps, id?: UniqueEntityId): Tenant {
    return new Tenant(props, id);
  }
}
