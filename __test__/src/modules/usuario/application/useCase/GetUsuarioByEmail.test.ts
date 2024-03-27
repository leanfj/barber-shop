import {
  GetUsuarioByEmail,
  type GetUsuarioByEmailOutput,
} from '../../../../../../src/modules/usuario/application/useCase/GetUsuarioByEmail';
import type IUsuarioRepository from '../../../../../../src/modules/usuario/domain/repositories/IUsuarioRepository';
import InMemoryUsuario from '../../../../../../src/modules/usuario/infrastructure/repositories/InMemoryUsuario';

describe('GetUsuarioByEmail', () => {
  it('should return an error if the user does not exist', async () => {
    const email = 'email@email.com';
    const usuarioRepository: IUsuarioRepository = new InMemoryUsuario();
    const getUsuarioByEmail = new GetUsuarioByEmail(usuarioRepository);

    const result: GetUsuarioByEmailOutput = await getUsuarioByEmail.execute({
      email,
    });

    expect(result.isLeft()).toBe(true);
  });
});
