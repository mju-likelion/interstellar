import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { WebClient } from '@slack/web-api';
import slackbotConfig from 'src/config/slackbotConfig';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SlackbotService {
  constructor(
    @Inject(slackbotConfig.KEY)
    readonly config: ConfigType<typeof slackbotConfig>
  ) {}
  async sendSlackCreateRoomNotific() {
    const client = new WebClient(this.config.slackbotTk);

    await client.chat.postMessage({
      channel: this.config.slackbotReportChannel,
      text: `방금 새로운 약속방이 생성되었습니다!`,
    });
    return;
  }

  @Cron('0 0 * * *') // 매일 자정에 실행
  async sendDailyRoomCount() {
    const client = new WebClient(this.config.slackbotTk);
    const dailyRoomCount = 0;

    await client.chat.postMessage({
      channel: this.config.slackbotReportChannel,
      text: `오늘 하루 총 방 생성 개수는 ${dailyRoomCount}개입니다.`,
    });
  }
}
