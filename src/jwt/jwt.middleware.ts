import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from './jwt.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers['x-jwt'];

      if (!token || typeof token !== 'string') {
        return next(); // No token, allow unauthenticated requests
      }

      // Verify JWT Token
      const decoded = this.jwtService.verify(token);
      if (!decoded || typeof decoded !== 'object' || !decoded.id) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // Find user by ID
      const user = await this.userService.findById(decoded.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Attach user to request for GraphQL context
      req['user'] = user;
      next();
    } catch (error) {
      console.error(`[JWT Middleware] Error: ${error.message}`);

      // NestJS GraphQL auto-handles exceptions if thrown
      throw new UnauthorizedException(error.message || 'Authentication failed');
    }
  }
}
