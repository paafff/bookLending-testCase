import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InitializationService } from './services/initialization/initialization.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Borrowings API')
    .setDescription('API documentation for the Borrowings service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const initializationService = app.get(InitializationService);
  try {
    await initializationService.initialize();
  } catch (error) {
    console.error('Initialization failed:', error);
  }

  await app.listen(3000);
}
bootstrap();
