import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { PrismaModule } from '@/prisma/prisma.module';

import { SlackbotService } from './slackbot.service';
import { SlackbotController } from './slackbot.controller';

@Module({
  controllers: [SlackbotController],
  imports: [PrismaModule, ScheduleModule.forRoot()],
  providers: [SlackbotService],
  exports: [SlackbotService],
})
export class SlackbotModule {}
