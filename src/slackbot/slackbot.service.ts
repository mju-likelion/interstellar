import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { WebClient } from '@slack/web-api';
import slackbotConfig from 'src/config/slackbotConfig';

@Injectable()
export class SlackbotService {
  constructor(
    @Inject(slackbotConfig.KEY)
    readonly config: ConfigType<typeof slackbotConfig>
  ) {}
  async sendSlackCreateRoomNotific() {
    const client = new WebClient(this.config.slackbotTk);

    await client.chat.postMessage({
      channel: '#createroom-notifications',
      text: `방금 새로운 약속방이 생성되었습니다!`,
    });
    return;
  }
}
