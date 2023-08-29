import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable } from '@nestjs/common';
import authConfig from 'src/config/authConfig';
import { ConfigType } from '@nestjs/config';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY) readonly config: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  createToken(username: string, roomCode: string) {
    const payload = { username, roomCode };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.config.jwtSecret,
        expiresIn: this.config.expiresIn,
      }),
    };
  }

  async validateUser(username: string, roomCode: string) {
    const user = await this.prismaService.user.findFirst({
      where: { username, roomId: roomCode },
      include: { room: true },
    });

    if (!user) return null;

    return user;
  }
}
