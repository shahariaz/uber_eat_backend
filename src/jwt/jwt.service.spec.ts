import { Test } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { CONFIG_OPTIONS } from './jwt.constants';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'signed-token'),
    verify: jest.fn(() => ({ id: 1 })),
  };
});
const mockConfigService = {
  get: jest.fn(),
};
const TEST_KEY = 'test-key';
describe('JwtService', () => {
  let service: JwtService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: CONFIG_OPTIONS,
          useValue: { privateKey: TEST_KEY },
        },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    service = module.get<JwtService>(JwtService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('sign', () => {
    it('should return a signed token', () => {
      const token = service.sign({ id: 1 });
      expect(typeof token).toBe('string');
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, TEST_KEY, {
        expiresIn: '5h',
        issuer: 'user-service',
      });
    });
  });

  describe('verify', () => {
    it('should return the payload', () => {
      const decode = service.verify('token');
      expect(decode).toEqual({ id: 1 });
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(jwt.verify).toHaveBeenCalledWith('token', TEST_KEY);
    });
  });
});
