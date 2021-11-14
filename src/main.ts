import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port: number = parseInt(`${process.env.DB_PORT}`) || 5001;
  await app.listen(port);

}
bootstrap();