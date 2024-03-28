import dotenv from 'dotenv';
dotenv.config({
  path:
    process.env.NODE_ENV === 'development'
      ? './env/.env.development'
      : './env/.env',
});
// eslint-disable-next-line import/first
import './core/infrastructure/http/server';
