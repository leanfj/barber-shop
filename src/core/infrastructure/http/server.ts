import InMemoryClienteRepository from '../../../modules/cliente/infrastructure/repositories/InMemoryCliente';
import InMemoryUsuarioRepository from '../../../modules/usuario/infrastructure/repositories/InMemoryUsuario';
import { ClienteService } from '../../../modules/cliente/application/Cliente.service';
import { UsuarioService } from '../../../modules/usuario/application/Usuario.service';
import { ClienteController } from '../../../modules/cliente/infrastructure/http/controllers/Cliente.controller';
import { UsuarioController } from '../../../modules/usuario/infrastructure/http/controllers/Usuario.controller';
import App from './app';
import colors from 'colors/safe';
import { TenantService } from '../../../modules/tenant/application/tenant.service';
import InMemoryTenantRepository from '../../../modules/tenant/infrastructure/repositories/InMemoryTenant';
import { LoginService } from '../../../modules/authentication/application/login.service';
import { LoginController } from '../../../modules/authentication/http/controllers/Login.Controller';

void (async () => {
  const tenantService = new TenantService(new InMemoryTenantRepository());
  const clienteService = new ClienteService(new InMemoryClienteRepository());
  const usuarioService = new UsuarioService(
    new InMemoryUsuarioRepository(),
    tenantService,
  );
  const loginService = new LoginService(usuarioService);

  const app = new App([
    new ClienteController(clienteService),
    new UsuarioController(usuarioService),
    new LoginController(loginService, usuarioService),
  ]);

  const server = app.listen();

  const closeServer = (): void => {
    console.log(colors.bold(colors.bgRed(colors.black('\nDesligando...'))));

    server.close(() => {
      console.log(
        colors.bold(
          colors.bgRed(colors.black('Fechando todas as conexões....')),
        ),
      );

      process.exit();
    });

    setTimeout(() => {
      console.error(
        colors.bold(
          colors.bgRed(
            colors.black(
              'Desligamento forçado por não conseguir fechar as conexões',
            ),
          ),
        ),
      );
      process.exit(1);
    }, 30 * 1000);
  };

  process.on('SIGINT', closeServer);
  process.on('SIGTERM', closeServer);
})();
