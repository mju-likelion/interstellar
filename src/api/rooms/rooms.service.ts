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
      errors.push('예약 가능한 날짜는 최소 1일, 최대 60일입니다.');
    }

    const uniqueDates = new Set(dates);
    if (dates.length !== uniqueDates.size) {
      errors.push('중복된 날짜가 있습니다.');
    }

    const sortedDates = [...dates].sort();
    if (dates.join(',') !== sortedDates.join(',')) {
      errors.push('날짜는 순서대로 입력되어야 합니다.');
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
      errors.push('예약 최대 가능 일자는 6개월입니다.');
    }

    if (
      !createRoomDto.dateOnly &&
      (!createRoomDto.startTime || !createRoomDto.endTime)
    ) {
      errors.push('dateOnly가 false인 경우 startTime과 endTime은 필수입니다.');
    }

    if (
      createRoomDto.dateOnly &&
      (createRoomDto.startTime || createRoomDto.endTime)
    ) {
      errors.push('dateOnly가 true인 경우 startTime과 endTime은 필수입니다.');
    }

    if (
      createRoomDto.startTime &&
      createRoomDto.endTime &&
      createRoomDto.startTime > createRoomDto.endTime
    ) {
      errors.push('startTime이 endTime보다 빠른 시간이어야 합니다.');
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

  findOne(id: string) {
    return `This action returns a ${id} room`;
  }

  getRoomReservation(id: string) {
    return `This action returns a ${id} room reservation`;
  }

  getRoomSummary(id: string) {
    return `This action returns a ${id} room summary`;
  }
}
