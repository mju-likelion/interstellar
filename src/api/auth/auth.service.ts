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

  async login(userName: string, password: string) {
    const payload = { userName, password };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.config.jwtSecret,
        expiresIn: this.config.expiresIn,
      }),
    };
  }

  async validateUser(username: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (!user || (user && !compare(password, user.password))) return null;
    return user;
  }
}
