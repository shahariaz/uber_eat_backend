import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from './jwt.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
// export function JwtMiddleware(req: Request, res: Response, next: NextFunction) {
//   if ('x-jwt' in req.headers) {
//     const token = req.headers['x-jwt'];
//     console.log(token);
//   }
//   next();
// }
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtSearvice: JwtService,
    private readonly userService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      try {
        const decoded = this.jwtSearvice.verify(String(token));
        if (
          typeof decoded === 'object' &&
          Object.prototype.hasOwnProperty.call(decoded, 'id')
        ) {
          const user = await this.userService.findById(decoded['id']);
          req['user'] = user;
        }
      } catch (error) {
        console.log('Invalid Token:', error);
      }
    }
    next();
  }
}
