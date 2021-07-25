import {User} from './../entities/user.entity';
import {InputType, OmitType, ObjectType} from '@nestjs/graphql';
import {CoreOutput} from 'src/common/dtos/core.dto';

@InputType()
export class CreateAccountInput extends OmitType(User, ['id']) {
}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {
}
