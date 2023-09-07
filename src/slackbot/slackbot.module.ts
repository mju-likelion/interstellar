import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { SlackbotService } from './slackbot.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [SlackbotService],
  exports: [SlackbotService],
})
export class SlackbotModule {}
