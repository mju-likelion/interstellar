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
  findOne(@Param() { code }: GetRoomReservationParamDto) {
    return this.roomsService.findOne(code);
  }

  @Get(':code/result')
  getRoomResult(@Param('code') code: string) {
    return this.roomsService.getRoomResult(code);
  }
}
