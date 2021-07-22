import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'seunggumon',
      password: '12345',
      database: 'seokkao-page',
      synchronize: true,
      logging: false,
    }),
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
