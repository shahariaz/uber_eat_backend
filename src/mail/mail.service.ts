import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './mail.contants';
import { EmailVar, MailModuleOptions } from './mail.interface';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    // this.sendEmail('test', 'test');
  }
  private async sendEmail(
    subject: string,
    template: string,
    to: string,
    emailVars: EmailVar[],
  ) {
    const form = new FormData();
    form.append(
      'from',
      `Shaharaiz From Uber Eats Excited User <mailgun@${this.options.domain}>`,
    );
    form.append('to', `shahariaz.info@gmail.com`);
    form.append('subject', subject);
    form.append('template', template);
    emailVars.forEach((eVar) => form.append(eVar.key, eVar.value));
    try {
      const response = await axios.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        form,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
        },
      );
      console.log('Mail Sent:', response.data);
      return response;
    } catch (error) {
      console.log('Error:', error);
      return error;
    }
  }
  async sendVerificationEmail(email: string, code: string) {
    await this.sendEmail('Verify Your Email', 'confrim message', email, [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}
