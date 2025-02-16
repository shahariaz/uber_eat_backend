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
      expiresIn: parseInt(this.options.expiresIn + '', 10),
      issuer: 'user-service',
    });
    return accessToken;
  }
}
