import { type IUseCase } from '@core:application/useCase/IUseCase';
import CPF from '@core:domain/valueObjects/CPF';
import Email from '@core:domain/valueObjects/Email';
import Cliente from '@modules/cliente/domain/entities/Cliente';
import type IClienteRepository from '@modules/cliente/domain/repositories/IClienteRepository';
import { ZodError } from 'zod';

export interface CadastrarClienteInput {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: Date;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  genero: string;
  dataCadastro: Date;
  dataAtualizacao: Date;
}

export interface CadastrarClienteSucesso {
  type: 'CadastrarClienteSucesso';
}

export interface ClienteJaCadastradoErro {
  type: 'ClienteJaCadastradoErro';
}

export interface InformacoesClienteInvalidasErro {
  type: 'InformacoesClienteInvalidasErro';
  message: string;
}

export interface UnexpectedError {
  type: 'UnexpectedError';
}

export type CadastrarClienteOutput =
  | CadastrarClienteSucesso
  | ClienteJaCadastradoErro
  | InformacoesClienteInvalidasErro
  | UnexpectedError;

export default class CadastrarCliente
  implements IUseCase<CadastrarClienteInput, CadastrarClienteOutput>
{
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(input: CadastrarClienteInput): Promise<CadastrarClienteOutput> {
    const existingCliente = await this.clienteRepository.findByNome(input.nome);

    if (existingCliente != null) {
      return { type: 'ClienteJaCadastradoErro' };
    }

    try {
      const cliente = Cliente.create({
        nome: input.nome,
        email: Email.setValue(input.email),
        telefone: input.telefone,
        cpf: CPF.setValue(input.cpf),
        dataNascimento: input.dataNascimento,
        endereco: input.endereco,
        cidade: input.cidade,
        estado: input.estado,
        cep: input.cep,
        genero: input.genero,
        dataCadastro: input.dataCadastro,
        dataAtualizacao: input.dataAtualizacao,
      });

      await this.clienteRepository.save(cliente);
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          type: 'InformacoesClienteInvalidasErro',
          message: error.issues.map((issue) => issue.message).join(', '),
        };
      }
    }

    return { type: 'CadastrarClienteSucesso' };
  }
}
