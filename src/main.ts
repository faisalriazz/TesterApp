import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('Gigatree API V1')
    .setDescription('Gigatree Backend Rest API Docs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(async () => {
    const url = await app.getUrl();
    console.log(`The server is running at ${url}, Swagger URL: ${url}/docs`);
  });
}

bootstrap();
