import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Wrong password');
    }
    return user;
  }

  async signup(email: string, password: string) {
    const user = await this.usersService.find(email);
    if (user.length) {
      throw new BadRequestException('User already exists');
    }
    // hash the users password
    // generate a salt
    const salt = randomBytes(8).toString('hex');
    // hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    return this.usersService.create(email, result);
  }
}
