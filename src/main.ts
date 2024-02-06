import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://admin-panel-phi-eight.vercel.app',
    credentials: true,
  });
  await app.listen(8080);
}
bootstrap();
