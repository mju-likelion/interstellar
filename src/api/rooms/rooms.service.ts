import { BadRequestException, Injectable } from '@nestjs/common';
import { Room } from '@prisma/client';
import { customAlphabet } from 'nanoid';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateRoomDto } from './dto/create-room.dto';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 6);

@Injectable()
export class RoomsService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 이 부분 상세 조건들은 아래 슬랙을 참고하시면 좋습니다
   * @see {@link https://www.notion.so/likelion-11th/6-6-8fdfd4c7268e4f70bd232dcee5078aab?pvs=4#ca12b4cd60904410bbb83549e748f1cd | Notion}
   */
  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const errors = [];

    const dates = createRoomDto.dates.split(',');
    if (dates.length < 1 || dates.length > 60) {
      errors.push('dates must be between 1 and 60');
    }

    const uniqueDates = new Set(dates);
    if (dates.length !== uniqueDates.size) {
      errors.push('dates must be unique');
    }

    const sortedDates = [...dates].sort();
    if (dates.join(',') !== sortedDates.join(',')) {
      errors.push('dates must be sorted');
    }

    const today = new Date(
      new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    );
    const lastDate = new Date(today.setMonth(today.getMonth() + 6));
    const lastDateString = `${lastDate.getFullYear()}-${(
      '0' +
      (lastDate.getMonth() + 1)
    ).slice(-2)}-${('0' + lastDate.getDate()).slice(-2)}`;
    if (sortedDates.at(-1) > lastDateString) {
      errors.push('dates must be within 6 months');
    }

    if (
      !createRoomDto.dateOnly &&
      (!createRoomDto.startTime || !createRoomDto.endTime)
    ) {
      errors.push('startTime and endTime are required when dateOnly is false');
    }

    if (
      createRoomDto.dateOnly &&
      (createRoomDto.startTime || createRoomDto.endTime)
    ) {
      errors.push(
        'startTime and endTime are not allowed when dateOnly is true'
      );
    }

    if (
      createRoomDto.startTime &&
      createRoomDto.endTime &&
      createRoomDto.startTime > createRoomDto.endTime
    ) {
      errors.push('startTime must be earlier than endTime');
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return this.prismaService.room.create({
      data: {
        ...createRoomDto,
        code: nanoid(),
        dateOnly: createRoomDto.dateOnly || false,
      },
    });
  }

  findOne(code: string) {
    return `This action returns a ${code} room`;
  }

  getRoomReservation(code: string) {
    return `This action returns a ${code} room reservation`;
  }

  getRoomSummary(code: string) {
    return `This action returns a ${code} room summary`;
  }
}
