import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Room } from '@prisma/client';
import uniq from 'lodash/uniq';
import { customAlphabet } from 'nanoid';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateRoomDto } from './dto/create-room.dto';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 6);

@Injectable()
export class RoomsService {
  constructor(private readonly prismaService: PrismaService) {}

  private convertStringToDate(stringDate: string): Date {
    return new Date(stringDate);
  }

  /**
   * @example filterUsersInDate(users, '2023-08-23')
   */
  private filterUsersInDate(
    users: { username: string; enableTimes: string[] }[],
    date: string
  ) {
    return users.filter(user => {
      const enableTimes = user.enableTimes;
      const enableDates = enableTimes.map(time => time.split(' ')[0]);

      return enableDates.includes(date);
    });
  }

  /**
   * 이 부분 상세 조건들은 아래 슬랙을 참고하시면 좋습니다
   * @see {@link https://www.notion.so/likelion-11th/6-6-8fdfd4c7268e4f70bd232dcee5078aab?pvs=4#ca12b4cd60904410bbb83549e748f1cd | Notion}
   */
  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    this.validateDates(createRoomDto);

    return this.prismaService.room.create({
      data: {
        code: nanoid(),
        ...createRoomDto,
        dateOnly: createRoomDto.dateOnly || false,
      },
    });
  }

  async findOne(code: string): Promise<Room> {
    const room = this.prismaService.room.findUnique({
      where: { code },
    });

    if (!room) {
      throw new NotFoundException(`Room with code ${code} not found`);
    }

    return room;
  }

  async getResult(code: string) {
    const room = await this.prismaService.room.findUnique({
      where: { code },
      include: {
        users: {
          select: {
            enableTimes: true,
          },
        },
      },
    });

    if (!room) {
      throw new NotFoundException(`Room with code ${code} not found`);
    }

    let enableTimesList: string[];

    if (room.dateOnly) {
      enableTimesList = room.users
        .map(user => user.enableTimes)
        .flat()
        .sort();
    } else {
      enableTimesList = room.users
        .map(user => uniq(user.enableTimes.map(time => time.split(' ')[0])))
        .flat()
        .map(time => time.split(' ')[0])
        .sort();
    }

    const timeMap = new Map();
    enableTimesList.forEach(time => {
      if (timeMap.has(time)) {
        timeMap.set(time, timeMap.get(time) + 1);
      } else {
        timeMap.set(time, 1);
      }
    });
    const enableTimes = Object.fromEntries(timeMap.entries());

    delete room.users;

    return {
      ...room,
      enableTimes,
    };
  }

  async getResultByDate(code: string, date: string) {
    const room = await this.prismaService.room.findUnique({
      where: { code },
      include: {
        users: {
          select: {
            username: true,
            enableTimes: true,
          },
        },
      },
    });

    const { users } = room;
    const filteredUsersInDate = this.filterUsersInDate(users, date);
    const { dateOnly, startTime, endTime } = room;

    // 날짜만 선택하는 방이면
    if (room.dateOnly) {
      return {
        code,
        dateOnly,
        votingUsers: filteredUsersInDate.map(user => user.username),
      };
    }

    // 모두가 선택한 시간들을 골라보기
    const selectedTimes = filteredUsersInDate
      .map(user => user.enableTimes)
      .flat()
      .map(time => time.split(' ')[1])
      .sort()
      .reduce((acc, cur) => {
        if (acc[cur]) {
          acc[cur] += 1;
        } else {
          acc[cur] = 1;
        }
        return acc;
      }, {});
    // 그 중 모두가 선택한 시간만 선택
    const everyoneSelectedTimes = Object.keys(selectedTimes).filter(
      time => selectedTimes[time] === filteredUsersInDate.length
    );

    // 시간도 선택하는 방이면
    return {
      code,
      dateOnly,
      startTime,
      endTime,
      votingUsers: filteredUsersInDate.map(user => user.username),
      everyoneSelectedTimes,
    };
  }

  validateDates(createRoomDto: CreateRoomDto) {
    const errors = [];

    const dates = createRoomDto.dates;
    const firstDate = this.convertStringToDate(dates[0]);
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const koreaTimeDiff = 9 * 60 * 60 * 1000;
    const nowKoreanDate = new Date(utc + koreaTimeDiff);

    const maxDate = new Date(
      nowKoreanDate.setMonth(nowKoreanDate.getMonth() + 6)
    );
    const maxDateString = `${maxDate.getFullYear()}-${(
      '0' +
      (maxDate.getMonth() + 1)
    ).slice(-2)}-${('0' + maxDate.getDate()).slice(-2)}`;

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

    if (
      firstDate.getMonth() < nowKoreanDate.getMonth() ||
      firstDate.getDate() < nowKoreanDate.getDate()
    ) {
      errors.push('first date must be today no matter how early it is.');
    }

    if (sortedDates.at(-1) > maxDateString) {
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
  }
}
