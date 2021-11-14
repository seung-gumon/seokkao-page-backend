import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  console.log(process.env.PORT , "PORT NUMBER")
  await app.listen(process.env.PORT || 5001);

}
bootstrap();