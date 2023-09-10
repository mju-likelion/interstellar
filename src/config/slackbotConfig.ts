import { registerAs } from '@nestjs/config';

export default registerAs('slackbot', () => ({
  slackbotTk: process.env.SLACKBOT_TOKEN,
  slackbotUserTk: process.env.SLACK_USER_TOKEN,
  slackbotReportChannel: process.env.SLACKBOT_REPORT_CHANNEL,
}));
