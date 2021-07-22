import { UserResolver } from './user.resolver';
import { Module } from '@nestjs/common';

@Module({
  providers: [UserResolver],
})
export class UserModule {}
