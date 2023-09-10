import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { SlackbotModule } from '@/slackbot/slackbot.module';

import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';

@Module({
  imports: [PrismaModule, SlackbotModule],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
