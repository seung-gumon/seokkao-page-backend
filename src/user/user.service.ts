import {LoginInput, LoginOutput, UpdateInput} from './dtos/login.dto';
import {User} from './entities/user.entity';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateAccountInput, CreateAccountOutput} from "./dtos/createAccount.dto";
import {JwtService} from "../jwt/jwt.service";
import {CoreOutput} from "../common/dtos/core.dto";



@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly user: Repository<User>,
        private readonly jwtService: JwtService
    ) {
    }

    async createAccount(createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
        try {
            const {email} = createAccountInput;

            const user = await this.user.findOne({email});

            if (user) {
                return {
                    ok: false,
                    error: "이미 해당 이메일의 아이디가 존재합니다."
                }
            }

            await this.user.save(await this.user.create(createAccountInput));

            return {
                ok: true,
            }

        } catch {
            return {
                ok: false,
                error: "새로고침후 다시 시도해주세요."
            }
        }
    }


    async login({email, password}: LoginInput): Promise<LoginOutput> {
        try {
            const user = await this.user.findOne({email});
            if (!user) {
                return {
                    ok: false,
                    error: '이메일과 비밀번호를 다시 한번 확인해주세요',
                };
            }

            const passwordCorrect = await user.checkPassword(password);

            if (!passwordCorrect) {
                return {
                    ok: false,
                    error: '이메일과 비밀번호를 다시 한번 확인해주세요',
                };
            }

            const token = this.jwtService.sign(user.id);

            return {
                ok: true,
                token,
            };
        } catch {
            return {
                ok: false,
                error: 'error',
            };
        }
    }


    async findByHeaderUserId(id : number) : Promise<User> {
        return this.user.findOne({id});
    }


    async editProfile(authUser : User,updateInput : UpdateInput) : Promise<CoreOutput> {
        try{

            await this.user.update(authUser.id , updateInput);

            return {
                ok : true
            }

        }catch (e) {
            return {
                ok : false,
                error : "계정을 수정하지 못하였습니다"
            }
        }
    }


}
