import { Module } from '@nestjs/common';

import { RoomsModule } from './api/rooms/rooms.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, RoomsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
