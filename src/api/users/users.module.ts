import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { AuthModule } from '../auth/auth.module';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
