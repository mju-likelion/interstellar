import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable } from '@nestjs/common';
import authConfig from 'src/config/authConfig';
import { ConfigType } from '@nestjs/config';
import { compare } from 'bcrypt';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY) readonly config: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  createToken(username: string) {
    const payload = { username };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.config.jwtSecret,
        expiresIn: this.config.expiresIn,
      }),
    };
  }

  async validateUser(username: string, password: string) {
    // TODO: 임시땜빵 - 추후 room code 를 같이 받도록 수정해야 함
    const user = await this.prismaService.user.findFirst({
      where: { username },
    });

    if (!user || (user && !compare(password, user.password))) return null;
    return user;
  }
}
