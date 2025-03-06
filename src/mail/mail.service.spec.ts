import { Test } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { CONFIG_OPTIONS } from './mail.contants';
import axios from 'axios';
import * as FormData from 'form-data';
// jest.mock('axios', () => ({
//   default: {
//     post: jest.fn(() => Promise.resolve({ status: 200 })),
//   },
// }));
jest.mock('axios');
jest.mock('form-data', () => {
  const mockAppend = jest.fn();
  const MockFormData = jest.fn().mockImplementation(() => ({
    append: mockAppend,
  }));
  MockFormData.prototype.append = mockAppend;
  return MockFormData;
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
  describe('sendVerificationEmail', () => {
    const sendVerificationEmailArgs = {
      email: 'test-email',
      code: 'test-code',
    };
    it('should send verification email', async () => {
      const sendEmailSpy = jest.spyOn(service, 'sendEmail');
      await service.sendVerificationEmail(
        sendVerificationEmailArgs.email,
        sendVerificationEmailArgs.code,
      );
      expect(sendEmailSpy).toHaveBeenCalledTimes(1);
      expect(sendEmailSpy).toHaveBeenCalledWith(
        'Verify Your Email',
        'confrim message',
        sendVerificationEmailArgs.email,
        [
          { key: 'code', value: sendVerificationEmailArgs.code },
          { key: 'username', value: sendVerificationEmailArgs.email },
        ],
      );
    });

    it('should send email', async () => {
      await service.sendEmail('', '', '', []);
      const fromSpy = jest.spyOn(FormData.prototype, 'append');

      expect(fromSpy).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalled();
    });
  });
});
