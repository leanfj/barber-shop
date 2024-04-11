import dotenv from 'dotenv';
dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
});

export class EnvConstants {
  public static readonly NODE_ENV: string =
    process.env.NODE_ENV ?? 'development';

  public static readonly PORT: number = parseInt(
    process.env.PORT ?? '3333',
    10,
  );

  public static readonly JWT_SECRET: string =
    process.env.JWT_SECRET ?? 'secret';

  public static readonly EMAIL_PROVIDER: string =
    process.env.EMAIL_PROVIDER ?? 'GMAIL';

  public static readonly EMAIL_HOST: string =
    process.env.EMAIL_HOST ?? 'smtp.gmail.com';

  public static readonly EMAIL_USERNAME: string =
    process.env.EMAIL_USERNAME ?? '';

  public static readonly EMAIL_PASSWORD: string =
    process.env.EMAIL_PASSWORD ?? '';

  public static readonly EMAIL_PORT: number = process.env.EMAIL_PORT
    ? parseInt(process.env.EMAIL_PORT, 10)
    : 587;

  public static readonly CLIENT_URL: string =
    process.env.CLIENT_URL ?? 'http://localhost:3000';

  public static readonly FROM_EMAIL: string =
    process.env.FROM_EMAIL ?? 'localhost@email.com';

  public static readonly POSTGRES_DB_NAME: string =
    process.env.POSTGRES_DB_NAME ?? '';

  public static readonly POSTGRES_DB_USERNAME: string =
    process.env.POSTGRES_DB_USERNAME ?? '';

  public static readonly POSTGRES_DB_PASSWORD: string =
    process.env.POSTGRES_DB_PASSWORD ?? '';

  public static readonly POSTGRES_DB_HOST: string =
    process.env.POSTGRES_DB_HOST ?? '';

  public static readonly POSTGRES_DB_PORT: number = process.env.POSTGRES_DB_PORT
    ? parseInt(process.env.POSTGRES_DB_PORT, 10)
    : 5432;

  public static readonly POSTGRES_DB_SCHEMA: string =
    process.env.POSTGRES_DB_SCHEMA ?? 'public';

  public static readonly DATABASE_URL: string = process.env.DATABASE_URL ?? '';
  public static readonly DIRECT_URL: string = process.env.DIRECT_URL ?? '';
}
