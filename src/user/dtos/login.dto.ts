import { User } from './../entities/user.entity';
import { ObjectType, Field, PickType, InputType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core.dto';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOuput extends CoreOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}
