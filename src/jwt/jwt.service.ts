import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './interfaces/jwt-module-options.interfaces';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}
  sign(payload: jwt.JwtPayload): string {
    const accessToken = jwt.sign(payload, this.options.privateKey, {
      expiresIn: '5h',
      issuer: 'user-service',
    });
    return accessToken;
  }
  verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }
}
