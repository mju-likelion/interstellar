import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { User } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

import { AuthService } from '../auth/auth.service';
import { RoomsService } from '../rooms/rooms.service';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly roomService: RoomsService,
    private authService: AuthService
  ) {}
  async createAppointment(createAppointmentDto: CreateAppointmentDto) {
    const errors400 = [];
    const errors404 = [];
    const { roomCode, username, password, dates, dateOnly } =
      createAppointmentDto;

    if (await this.findOne(username)) {
      errors400.push('Username already exists');
    }

    const uniqueDates = new Set(dates);
    if (dates.length !== uniqueDates.size) {
      errors400.push('dates must be unique');
    }
    /*
    dates는 ['2023-07-19 12:30','2023-07-20 13:45']이런 식으로 된 배열이며 
    공백을 기준으로 날짜와 시간으로 나눕니다.
    */
    if (!dateOnly) {
      for (const date of dates) {
        const [_, selectedTime] = date.split(' ');
        if (!selectedTime) {
          errors400.push('Time must be selected when dateOnly is false');
          break;
        }
      }
    }

    const sortedDates = dates.sort();
    if (dates.join(',') !== sortedDates.join(',')) {
      errors400.push('dates must be sorted');
    }

    if (errors400.length > 0) {
      throw new BadRequestException(errors400);
    }

    if (!(await this.roomService.findOne(roomCode))) {
      errors404.push('Room does not exist');
    }

    const hashedPassword = await hash(password, 10);
    const token = this.authService.login(username, password);

    if (errors404.length > 0) {
      throw new NotFoundException(errors404);
    }

    try {
      await this.prismaService.user.create({
        data: {
          username,
          password: hashedPassword,
          enableTimes: dates,
          roomId: roomCode,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }

    return token;
  }

  findOne(username: string): Promise<User> {
    return this.prismaService.user.findUnique({
      where: { username },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}
