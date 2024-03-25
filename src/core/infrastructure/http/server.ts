import InMemoryClienteRepository from '../../../modules/cliente/infrastructure/repositories/InMemoryCliente';
import { ClienteService } from '../../../modules/cliente/application/Cliente.service';
import { ClienteController } from '../../../modules/cliente/infrastructure/http/controllers/Cliente.controller';
import App from './app';
import colors from 'colors/safe';

void (async () => {
  const clienteService = new ClienteService(new InMemoryClienteRepository());

  const app = new App([new ClienteController(clienteService)]);

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
