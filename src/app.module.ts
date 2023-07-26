import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RoomsModule } from '@/api/rooms/rooms.module';
import { UsersModule } from '@/api/users/users.module';
import { PrismaModule } from '@/prisma/prisma.module';

import { AuthModule } from './api/auth/auth.module';
import authConfig from './config/authConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig],
    }),
    PrismaModule,
    RoomsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
