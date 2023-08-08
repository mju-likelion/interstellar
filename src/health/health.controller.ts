import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health-check')
  healthCheck() {
    return {
      status: 'ok',
    };
  }
}
