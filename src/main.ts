import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as csrfDSC from 'express-csrf-double-submit-cookie';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const csrfProtection = csrfDSC();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Increase request body size
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Security
  app.enableCors();
  app.use(cookieParser());
  app.use(csrfProtection);

  // Modal Validations
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Exception Filter

  // Interceptors

  // Listen on any available port (dynamic port assignment)
  const server = await app.listen(0);

  const address = server.address();
  if (typeof address === 'string') {
    console.log(`Server listening on ${address}`);
  } else {
    const { port, family, address: host } = address;
    console.log(`Server listening at http://${host}:${port} (${family})`);
  }
}

bootstrap();