import type Usuario from '../../domain/entities/Usuario';
import type IUsuarioRepository from '../../domain/repositories/IUsuario.repository';

export default class InMemoryUsuario implements IUsuarioRepository {
  private readonly usuarios: Usuario[] = [];

  async findByEmail(email: string): Promise<any> {
    return this.usuarios.find((usuario) => usuario.email === email);
  }

  async save(usuario: Usuario): Promise<any> {
    this.usuarios.push(usuario);
  }

  async exists(t: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async delete(t: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
