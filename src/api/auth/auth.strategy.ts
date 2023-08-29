import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import authConfig from 'src/config/authConfig';
import { ConfigType } from '@nestjs/config';

import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(authConfig.KEY) readonly config: ConfigType<typeof authConfig>,
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }
  //토큰 검증
  async validate(payload: any) {
    console.log('validate called');
    const { username, roomCode } = payload;
    const user = await this.authService.validateUser(username, roomCode);
    console.log(user);
    return user;
  }
}
