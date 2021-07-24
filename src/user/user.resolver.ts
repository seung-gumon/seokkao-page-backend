import { LoginOuput, LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => LoginOuput)
  async Login(@Args('input') loginInput: LoginInput): Promise<LoginOuput> {
    return await this.userService.login(loginInput);
  }

  @Query(() => [User])
  async findUser(): Promise<User[]> {
    return await this.userService.getUser();
  }
}
