import { Module } from '@nestjs/common';

import { RoomsModule } from '@/api/rooms/rooms.module';
import { UsersModule } from '@/api/users/users.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule, RoomsModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
