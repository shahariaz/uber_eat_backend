import { DynamicModule, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from './mail.contants';
import { MailModuleOptions } from './mail.interface';

@Module({})
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      exports: [],
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
