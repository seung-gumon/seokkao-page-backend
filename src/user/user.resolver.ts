import { Query, Resolver } from '@nestjs/graphql';
@Resolver()
export class UserResolver {
  @Query(() => Boolean)
  isPizzaGood(): Boolean {
    return true;
  }
}
