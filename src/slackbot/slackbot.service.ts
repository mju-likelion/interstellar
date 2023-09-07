import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { WebClient } from '@slack/web-api';
import slackbotConfig from 'src/config/slackbotConfig';
import * as cron from 'node-cron';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SlackbotService {
  constructor(
    @Inject(slackbotConfig.KEY)
    readonly config: ConfigType<typeof slackbotConfig>,
    private readonly prismaService: PrismaService
  ) {
    // 한국 시간에 맞춰서 매일 자정에 sendDailyRoomCount 함수를 실행합니다.
    cron.schedule('0 0 * * *', this.sendDailyRoomCount.bind(this), {
      timezone: 'Asia/Seoul',
    });
  }
  private async getTodayRoomCount(): Promise<number> {
    // 오늘 날짜의 시작과 끝 시간을 구합니다.
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Prisma를 사용하여 해당 범위에 있는 레코드의 개수를 검색합니다.
    const count = await this.prismaService.room.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return count;
  }

  async sendSlackCreateRoomNotific() {
    const client = new WebClient(this.config.slackbotTk);

    await client.chat.postMessage({
      channel: this.config.slackbotReportChannel,
      text: `방금 새로운 약속방이 생성되었습니다!`,
    });
    return;
  }

  async sendDailyRoomCount() {
    const client = new WebClient(this.config.slackbotTk);
    const dailyRoomCount = await this.getTodayRoomCount();

    await client.chat.postMessage({
      channel: this.config.slackbotReportChannel,
      text: `오늘 하루 총 방 생성 개수는 ${dailyRoomCount}개입니다.`,
    });
  }
}
