import { Injectable } from '@nestjs/common';

import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  create(createRoomDto: CreateRoomDto) {
    return 'This action adds a new room';
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
