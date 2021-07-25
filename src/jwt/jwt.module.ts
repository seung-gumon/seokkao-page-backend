import {DynamicModule, Global, Module} from '@nestjs/common';
import {JwtService} from './jwt.service';
import {JwtModuleOptions} from "./interfaces/jwt-module.options.interface";

@Global()
@Module({})
export class JwtModule {
    static forRoot(options: JwtModuleOptions): DynamicModule {
        return {
            module: JwtModule,
            providers: [
                {
                    provide: "CONFIG_OPTIONS",
                    useValue: options
                },
                JwtService
            ],
            exports: [JwtService]
        }
    }
}
