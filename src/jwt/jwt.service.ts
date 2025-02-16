import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './interfaces/jwt-module-options.interfaces';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly test: JwtModuleOptions,
  ) {}
  sayHello() {
    console.log('hello');
  }
}
