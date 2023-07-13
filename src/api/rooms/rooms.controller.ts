import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetRoomReservationParamDto } from './dto/get-room-reservation-param.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get(':code')
  getRoomReservation(@Param() { code }: GetRoomReservationParamDto) {
    return this.roomsService.getRoomReservation(code);
  }

  @Get(':code/summary')
  getRoomSummary(@Param('code') code: string) {
    return this.roomsService.getRoomSummary(code);
  }
}
