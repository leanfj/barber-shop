import Entity from '../../../../core/domain/entities/Entity';
import type UniqueEntityId from '../../../../core/domain/entities/UniqueEntityId';

interface TenantProps {
  id?: string;
  nome: string;
  slug?: string;
  isAtivo: boolean;
  dataCadastro?: Date;
  dataAtualizacao?: Date;
}

export default class Tenant extends Entity<TenantProps> {
  constructor(props: TenantProps, id?: UniqueEntityId) {
    super(props, id);
    this.setSlug();
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  get nome(): string {
    return this.props.nome;
  }

  get slug(): string | undefined {
    return this.props.slug;
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

  private setSlug(): void {
    this.props.slug = this.props.nome.toLowerCase().replace(/ /g, '_');
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
