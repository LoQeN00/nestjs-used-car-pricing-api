import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email.toLowerCase());

    if (users.length) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await hash(password, 12);

    const newUser = await this.usersService.create(email, hashedPassword);

    return newUser;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email.toLowerCase());
    if (!user) {
      throw new NotFoundException('Wrong Credentials!');
    }

    const match = await compare(password, user.password);

    if (!match) {
      throw new NotFoundException('Wrong Credentials!');
    }

    return user;
  }
}
