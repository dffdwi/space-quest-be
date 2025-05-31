import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['verbose', 'log', 'warn', 'error'],
  });

  app.enableCors({ origin: true, exposedHeaders: ['*'] });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useStaticAssets(
    join(__dirname, '..', 'node_modules', 'swagger-ui-dist'),
    {
      prefix: '/swagger-static',
    },
  );

  const config = new DocumentBuilder()
    .setTitle('Space Quest')
    .setDescription('API documentation for Space Quest')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.warn(`Application is running on: http://localhost:${port}`);
  Logger.warn(`Swagger docs available at: http://localhost:${port}/docs`);
}
bootstrap();
