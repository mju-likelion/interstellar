import { Module } from '@nestjs/common';

import { SlackbotService } from './slackbot.service';
import { SlackbotController } from './slackbot.controller';

@Module({
  controllers: [SlackbotController],
  providers: [SlackbotService],
  exports: [SlackbotService],
})
export class SlackbotModule {}
