import {User} from './user/entities/user.entity';
import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {UserModule} from './user/user.module';
import {GraphQLModule} from '@nestjs/graphql';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {JwtModule} from './jwt/jwt.module';
import {JwtMiddleware} from "./jwt/jwt.middleware";
import {AuthModule} from "./auth/auth.module";
import {CategoryModule} from './category/category.module';
import {Category} from "./category/entities/category.entity";
import { SeriesModule } from './series/series.module';
import {Series} from "./series/entities/series.entity";
import {Part} from "./episode/entities/part.entity";
import {UploadsModule} from "./uploads/uploads.module";
import {Episode} from "./episode/entities/episode.entity";
import {PurChaseHistory} from "./episode/entities/purchaseHistory.entity";
import { EpisodeModule } from './episode/episode.module';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
            ignoreEnvFile: process.env.NODE_ENV === 'production',
        }),
        GraphQLModule.forRoot({
            autoSchemaFile: true,
            cors: {
                origin: ['http://localhost:3000'],
                credentials: true,
            },
            context: ({req}) => ({user: req['user']})
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            synchronize: true,
            logging: false,
            entities: [User, Category , Series , Part , Episode , PurChaseHistory],
        }),
        UserModule,
        AuthModule,
        JwtModule.forRoot({
            privateKey: process.env.SECRET_KEY
        }),
        CategoryModule,
        SeriesModule,
        UploadsModule,
        EpisodeModule
    ],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes({
            path: "/graphql",
            method: RequestMethod.POST
        })
    }
}
