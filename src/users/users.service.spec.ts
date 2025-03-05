import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Verification } from './entites/verification.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

// Mock Factory Function for Repositories
const mockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

// Mock Services
const mockJwtService = { sign: jest.fn(), verify: jest.fn() };
const mockMailService = { sendVerificationEmail: jest.fn() };
const mockConfigService = { get: jest.fn() };

describe('UserService', () => {
  let service: UsersService;
  let userRepository: Partial<Record<keyof Repository<User>, jest.Mock>>;
  let verificationRepo: Partial<
    Record<keyof Repository<Verification>, jest.Mock>
  >;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepository() },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailService, useValue: mockMailService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    verificationRepo = module.get(getRepositoryToken(Verification));
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Ensures each test starts fresh
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: 'test@example.com',
      password: 'test1234',
      role: 0,
    };

    it('should fail if user already exists', async () => {
      userRepository.findOne?.mockResolvedValue({
        id: 1,
        email: createAccountArgs.email,
      });

      const result = await service.createAccount(createAccountArgs);

      expect(result).toEqual({
        ok: false,
        error: 'There is already a user with that email',
      });

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should create a new user and send verification email', async () => {
      userRepository.findOne?.mockResolvedValue(undefined);
      userRepository.create?.mockReturnValue(createAccountArgs);
      userRepository.save?.mockResolvedValue(createAccountArgs);

      const mockVerification = { code: 'test-code', user: createAccountArgs };
      verificationRepo.create?.mockReturnValue(mockVerification);
      verificationRepo.save?.mockResolvedValue(mockVerification);

      const result = await service.createAccount(createAccountArgs);

      // Verify user creation
      expect(userRepository.create).toHaveBeenCalledWith(createAccountArgs);
      expect(userRepository.save).toHaveBeenCalledWith(createAccountArgs);

      // Verify verification entity creation
      expect(verificationRepo.create).toHaveBeenCalledWith({
        user: createAccountArgs,
      });
      expect(verificationRepo.save).toHaveBeenCalledWith(mockVerification);

      // Verify email service call
      expect(mockMailService.sendVerificationEmail).toHaveBeenCalledWith(
        createAccountArgs.email,
        mockVerification.code,
      );

      // Verify success response
      expect(result).toEqual({ ok: true });
    });

    it.todo('login');
    it.todo('findById');
    it.todo('editProfile');
    it.todo('verifyEmail');
  });
});
