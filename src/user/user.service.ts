import { LoginInput, LoginOuput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  async login({ email, password }: LoginInput): Promise<LoginOuput> {
    try {
      const user = await this.user.findOne({ email });
      if (user) {
        return {
          ok: false,
          error: '이미 존재하는 이메일입니다',
        };
      }

      const passwordCorrect = await user.checkPassword(password);

      if (!passwordCorrect) {
        return {
          ok: false,
          error: '비밀번호가 틀렸습니다.',
        };
      }

      return {
        ok: true,
        token: 'hello IM TOKEN',
      };
    } catch {
      return {
        ok: false,
        error: 'error',
      };
    }
  }

  async getUser(): Promise<User[]> {
    return await this.user.find();
  }
}
