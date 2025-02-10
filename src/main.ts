import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Server is running at http://localhost:${process.env.PORT ?? 3000}`,
  );
}
bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
