import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './mail.contants';
import { MailModuleOptions } from './mail.interface';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}
  private sendEmail({});
}
