import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports : [UserService],
  providers: [UserResolver, UserService],
})
export class UserModule {}
