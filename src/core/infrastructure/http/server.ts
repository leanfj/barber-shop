import InMemoryClienteRepository from '../../../modules/cliente/infrastructure/repositories/InMemoryCliente';
import { ClienteService } from '../../../modules/cliente/application/Cliente.service';
import { UsuarioService } from '../../../modules/usuario/application/Usuario.service';
import { ClienteController } from '../../../modules/cliente/infrastructure/http/controllers/Cliente.controller';
import { UsuarioController } from '../../../modules/usuario/infrastructure/http/controllers/Usuario.controller';
import App from './app';
import colors from 'colors/safe';
import { TenantService } from '../../../modules/tenant/application/tenant.service';
import { AuthenticationService } from '../../../modules/authentication/application/authentication.service';
import { AuthenticationController } from '../../../modules/authentication/infrastructure/http/controllers/Authentication.Controller';
import { EmailService } from '../.././../modules/email/application/Email.service';
import { GmailEmailGateway } from '../../../modules/email/infrastructure/email/GmailEmailServiceRepository';
import { MailHogEmailGateway } from '../../../modules/email/infrastructure/email/MailhogEmailServiceGateway';
import PrismaUsuarioRepository from '../../../modules/usuario/infrastructure/repositories/PrismaUsuario.repository';
import PrismaTenantRepository from '../../../modules/tenant/infrastructure/repositories/PrismaTenant.repository';
import { PrismaTokenRepository } from '../../../modules/authentication/infrastructure/repositories/PrismaToken.repository';

void (async () => {
  const tenantService = new TenantService(new PrismaTenantRepository());
  const clienteService = new ClienteService(new InMemoryClienteRepository());
  const usuarioService = new UsuarioService(
    new PrismaUsuarioRepository(),
    tenantService,
  );
  const gmailEmailGateway = new GmailEmailGateway();
  const mailhogEmailGateway = new MailHogEmailGateway();
  const emailService = new EmailService(
    process.env.EMAIL_PROVIDER === 'GMAIL'
      ? gmailEmailGateway
      : mailhogEmailGateway,
  );
  const authenticationService = new AuthenticationService(
    usuarioService,
    emailService,
    new PrismaTokenRepository(),
  );

  const app = new App([
    new ClienteController(clienteService),
    new UsuarioController(usuarioService),
    new AuthenticationController(authenticationService),
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
