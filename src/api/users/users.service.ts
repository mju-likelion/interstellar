import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';

import { PrismaService } from '@/prisma/prisma.service';

import { AuthService } from '../auth/auth.service';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private authService: AuthService
  ) {}
  async createAppointement(createAppointmentDto: CreateAppointmentDto) {
    const errors = [];
    const { roomCode, userName, password, dates, dateOnly } =
      createAppointmentDto;

    if (
      !(await this.prismaService.room.findUnique({ where: { code: roomCode } }))
    ) {
      errors.push('Room does not exist');
    }

    if (await this.prismaService.user.findUnique({ where: { userName } })) {
      //userName 중복 확인
      errors.push('Username already exists');
    }

    const hashedPassword = await hash(password, 10);
    const token = this.authService.login(userName, password);
    console.log(token);
    const uniqueDates = new Set(dates);
    if (dates.length !== uniqueDates.size) {
      errors.push('dates must be unique');
    }
    /*
    dates는 ['2023-07-19 12:30','2023-07-20 13:45']이런 식으로 된 배열이며 
    공백을 기준으로 날짜와 시간으로 나눕니다.
    */
    if (!dateOnly) {
      for (const date of dates) {
        const [_, selectedTime] = date.split(' ');
        if (!selectedTime) {
          errors.push('Time must be selected when dateOnly is false');
          break;
        }
      }
    }

    const sortedDates = dates.sort();
    if (dates.join(',') !== sortedDates.join(',')) {
      errors.push('dates must be sorted');
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    await this.prismaService.user.create({
      data: {
        userName,
        password: hashedPassword,
        enableTimes: dates,
        roomId: roomCode,
      },
    });

    return token;
  }

  findUsersByRoom(roomId: number) {
    return `This action returns all users by room id ${roomId}`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}
