import {
  type CadastrarUsuarioOutput,
  type CadastraUsuarioInput,
  CadastraUsuario,
} from '../../../../../../src/modules/usuario/application/useCase/CadastraUsuario';
import type Usuario from '../../../../../../src/modules/usuario/domain/entities/Usuario';
import type IUsuarioRepository from '../../../../../../src/modules/usuario/domain/repositories/IUsuario.repository';
import InMemoryUsuario from '../../../../../../src/modules/usuario/infrastructure/repositories/InMemoryUsuario';

describe('CadastraUsuario UseCase', () => {
  let cadastrarUsuarioUseCase: CadastraUsuario;

  beforeEach(() => {
    const usuarioRepository: IUsuarioRepository = new InMemoryUsuario();
    cadastrarUsuarioUseCase = new CadastraUsuario(usuarioRepository);
  });

  it('should create a new user', async () => {
    const input: CadastraUsuarioInput = {
      tenantId: 'tenantId',
      nome: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      isActive: true,
    };

    const result: CadastrarUsuarioOutput =
      await cadastrarUsuarioUseCase.execute(input);
    const usuario = result.value.getValue() as Usuario;
    expect(result.isRight()).toBe(true);
    expect(usuario.tenantId).toBe(input.tenantId);
  });

  // it('should return an error if the user already exists', async () => {
  //   const input: CadastraUsuarioInput = {
  //     tenantId: 'tenantId',
  //     nome: 'John Doe',
  //     email: 'john@example.com',
  //     password: 'password',
  //     isActive: true,
  //   };

  //   const usuarioExists: Usuario = {
  //     tenantId: input.tenantId,
  //     nome: input.nome,
  //     email: input.email,
  //     password: 'hashedPassword',
  //     isActive: input.isActive,
  //     dataCadastro: new Date(),
  //     dataAtualizacao: new Date(),
  //   };
  //   (usuarioRepository.findByEmail as jest.Mock).mockResolvedValueOnce(
  //     usuarioExists,
  //   );

  //   const result: CadastrarUsuarioOutput =
  //     await cadastrarUsuarioUseCase.execute(input);

  //   expect(result.isLeft()).toBe(true);
  //   expect(result.extract()).toEqual(
  //     left(new CadastraUsuarioErrors.UsuarioAlreadyExists(input.email)),
  //   );
  //   expect(usuarioRepository.findByEmail).toHaveBeenCalledWith(input.email);
  //   expect(bcrypt.genSalt).not.toHaveBeenCalled();
  //   expect(bcrypt.hash).not.toHaveBeenCalled();
  //   expect(usuarioRepository.save).not.toHaveBeenCalled();
  // });

  // it('should return an error if an unexpected error occurs', async () => {
  //   const input: CadastraUsuarioInput = {
  //     tenantId: 'tenantId',
  //     nome: 'John Doe',
  //     email: 'john@example.com',
  //     password: 'password',
  //     isActive: true,
  //   };

  //   const error = new Error('Unexpected error');
  //   (usuarioRepository.findByEmail as jest.Mock).mockRejectedValueOnce(error);

  //   const result: CadastrarUsuarioOutput =
  //     await cadastrarUsuarioUseCase.execute(input);

  //   expect(result.isLeft()).toBe(true);
  //   expect(result.extract()).toEqual(left(new AppError.UnexpectedError(error)));
  //   expect(usuarioRepository.findByEmail).toHaveBeenCalledWith(input.email);
  //   expect(bcrypt.genSalt).not.toHaveBeenCalled();
  //   expect(bcrypt.hash).not.toHaveBeenCalled();
  //   expect(usuarioRepository.save).not.toHaveBeenCalled();
  // });
});
