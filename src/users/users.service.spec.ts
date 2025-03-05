import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Verification } from './entites/verification.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { ObjectLiteral, Repository } from 'typeorm';
const mockRepository = () => {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
};
const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};
const mockMailService = {
  sendVerificationEmail: jest.fn(),
};
const mockConfigService = {
  get: jest.fn(),
};
type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;
describe('UserService', () => {
  let service: UsersService;
  let userRepository: MockRepository<User>;
  beforeAll(async () => {
    const modules = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();
    service = modules.get<UsersService>(UsersService);
    userRepository = modules.get(getRepositoryToken(User));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createAccount', () => {
    const createAccountArgs = {
      email: '',
      password: '',
      role: 0,
    };
    it('should fail if user exists', async () => {
      userRepository.findOne?.mockResolvedValue({
        id: 1,
        email: 'shahriaz.info@gmail.com',
      });
      const result = await service.createAccount(createAccountArgs);
      expect(result).toMatchObject({
        ok: false,
        error: 'There is already a user with that email',
      });
    });
    it('should create a new user', async () => {
      userRepository.findOne?.mockResolvedValue(undefined);
      userRepository.create?.mockReturnValue(createAccountArgs);
      await service.createAccount(createAccountArgs);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(createAccountArgs);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(createAccountArgs);
    });

    it.todo('login');
    it.todo('findById');
    it.todo('editProfile');
    it.todo('verifyEmail');
  });
});
