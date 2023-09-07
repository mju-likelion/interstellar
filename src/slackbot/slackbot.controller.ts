import { Controller, Get } from '@nestjs/common';

import { SlackbotService } from './slackbot.service';

@Controller('slackbot')
export class SlackbotController {
  constructor(private readonly slackbotService: SlackbotService) {}

  @Get('test')
  sendSlackCreateRoomNotific() {
    return this.slackbotService.sendSlackCreateRoomNotific();
  }
}
