import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RoomsModule } from '@/api/rooms/rooms.module';
import { UsersModule } from '@/api/users/users.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { HealthModule } from '@/health/health.module';

import { AuthModule } from './api/auth/auth.module';
import { SlackbotModule } from './slackbot/slackbot.module';
import authConfig from './config/authConfig';
import slackbotConfig from './config/slackbotConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, slackbotConfig],
    }),
    PrismaModule,
    RoomsModule,
    UsersModule,
    AuthModule,
    HealthModule,
    SlackbotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
