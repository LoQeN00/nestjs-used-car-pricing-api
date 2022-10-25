import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await hash(password, 12);

    const newUser = await this.usersService.create(email, hashedPassword);

    return newUser;
  }

  signin() {}
}
