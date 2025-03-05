import { Test } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { CONFIG_OPTIONS } from './mail.contants';
import axios from 'axios';
import * as FormData from 'form-data';
jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      post: jest.fn(),
    })),
  };
});
jest.mock('form-data', () => {
  return {
    append: jest.fn(),
  };
});
const mockConfigService = {
  get: jest.fn((key) => {
    if (key === 'MAILGUN_API_KEY') return 'test-api-key';
    if (key === 'MAILGUN_DOMAIN_NAME') return 'test-domain';
    if (key === 'MAILGUN_FROM_EMAIL') return 'test-email';
    return null;
  }),
};
describe('MailService', () => {
  let service: MailService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            apiKey: 'test-api-key',
            domain: 'test-domain',
            fromEmail: 'test-email',
          },
        },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
