import {Inject, Injectable} from '@nestjs/common';
import {JwtModuleOptions} from "./interfaces/jwt-module.options.interface";
import * as jwt from 'jsonwebtoken';


@Injectable()
export class JwtService {
    constructor(
        @Inject('CONFIG_OPTIONS')
        private readonly configOptions: JwtModuleOptions
    ) {
    }

    sign(userId: number): string {
        return jwt.sign({id: userId}, this.configOptions.privateKey , {
            expiresIn : "1d"
        });
    }

    verify(token : string) {
        return jwt.verify(token , this.configOptions.privateKey);
    }

}
