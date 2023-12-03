import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  const users: User[] = [];
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    // create fake service of UserService
    fakeUsersService = {
      find: (email) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it(`can create a instance of AuthService`, async () => {
    expect(service).toBeDefined();
  });

  it('should create a user with salt and hashed and password', async () => {
    const user = await service.signup('safdar@yahoo.com', '123456');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it(`throws an error if user signs up with email that is in use`, async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          email: 'safdar@yahoo.com',
          id: 1,
        } as User,
      ]);
    await expect(service.signup('safdar@yahoo.com', '123456')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw if signin is called with an unused email', async () => {
    await expect(
      service.signin('safdar123@yahoo.com', '123456'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should allow user to login with valid username and password', async () => {
    await service.signup('safdar11@yahoo.com', '123');
    const user = await service.signin('safdar11@yahoo.com', '123');
    expect(user).toBeDefined();
  });

  it('should give me an error if I try to login with wrong password', async () => {
    await expect(service.signin('safdar11@yahoo.com', '1234')).rejects.toThrow(
      BadRequestException,
    );
  });
});
