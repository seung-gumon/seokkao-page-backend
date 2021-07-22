import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  @Query(() => String)
  async isPizza(): Promise<string> {
    return 'I Love Pizza';
  }
}
