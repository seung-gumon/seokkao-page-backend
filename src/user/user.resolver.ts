import {LoginOutput, LoginInput, UpdateInput} from './dtos/login.dto';
import {User} from './entities/user.entity';
import {UserService} from './user.service';
import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CreateAccountInput, CreateAccountOutput} from "./dtos/createAccount.dto";
import {AuthUser} from "../auth/auth-user.decorator";
import {Roles} from "../auth/role.decorator";
import {CoreOutput} from "../common/dtos/core.dto";

@Resolver()
export class UserResolver {
    constructor(
        private readonly userService: UserService,
    ) {
    }

    @Mutation(() => LoginOutput)
    async Login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        return await this.userService.login(loginInput);
    }


    @Mutation(() => CreateAccountOutput)
    async createAccount(
        @Args('input') createAccount: CreateAccountInput,
    ): Promise<CreateAccountOutput> {
        return await this.userService.createAccount(createAccount);
    }


    @Query(() => User)
    @Roles(['Any'])
    me(@AuthUser() authUser: User) {
        return authUser;
    }


    @Mutation(() => CoreOutput)
    @Roles(['Any'])
    async editProfile(
        @AuthUser() authUser : User,
        @Args('input') updateInput : UpdateInput
    ) : Promise<CoreOutput> {
        return await this.userService.editProfile(authUser,updateInput);
    }


}