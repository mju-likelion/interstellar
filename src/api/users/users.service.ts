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

  private async isDateOnlyFormatValid(dateOnly: boolean, dates: string[]) {
    let result = true;
    if (!dateOnly) {
      for (const date of dates) {
        const [_, selectedTime] = date.split(' ');
        if (!selectedTime) {
          result = false;
        }
      }
    }
    return result;
  }

  async findOne(username: string): Promise<User> {
    return this.prismaService.user.findUnique({
      where: { username },
    });
  }

  async createAppointment(createAppointmentDto: CreateAppointmentDto) {
    const badRequestErros = [];
    const notFoundErros = [];
    const { roomCode, username, password, dates, dateOnly } =
      createAppointmentDto;

    const uniqueDates = new Set(dates);
    if (dates.length !== uniqueDates.size) {
      badRequestErros.push('dates must be unique');
    }
    /*
    dates는 ['2023-07-19 12:30','2023-07-20 13:45']이런 식으로 된 배열이며
    공백을 기준으로 날짜와 시간으로 나눕니다.
    */
    if (!(await this.isDateOnlyFormatValid(dateOnly, dates))) {
      badRequestErros.push('Time must be provided when dateOnly is false');
    }

    const sortedDates = dates.sort();
    if (dates.join(',') !== sortedDates.join(',')) {
      badRequestErros.push('dates must be sorted');
    }

    if (badRequestErros.length > 0) {
      throw new BadRequestException(badRequestErros);
    }
    console.log(roomCode);
    if (!(await this.roomService.findOne(roomCode))) {
      notFoundErros.push('Room does not exist');
    }

    const hashedPassword = await hash(password, 10);
    const token = this.authService.login(username, password);

    if (notFoundErros.length > 0) {
      throw new NotFoundException(notFoundErros);
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

  async update(roomCode: string, updateUserDto: UpdateUserDto) {
    const badRequestErros = [];
    const notFoundErros = [];
    const { username, dates, dateOnly } = updateUserDto;
    const userInfo = await this.findOne(username);

    if (!userInfo) {
      badRequestErros.push('User does not exist');
    }

    if (!(await this.roomService.findOne(roomCode))) {
      notFoundErros.push('Room does not exist');
    }

    // 해당 유저가 수정한 가용시간에 대한 유효성을 검사한다.
    if (!(await this.isDateOnlyFormatValid(dateOnly, dates))) {
      badRequestErros.push('Time must be provided when dateOnly is false');
    }

    if (badRequestErros.length > 0) {
      throw new BadRequestException(badRequestErros);
    }

    if (notFoundErros.length > 0) {
      throw new NotFoundException(notFoundErros);
    }

    return await this.prismaService.user.update({
      where: { username },
      data: { enableTimes: dates },
    });
  }
}
