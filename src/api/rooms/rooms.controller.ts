import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get(':id')
  getRoomReservation(@Param('id') id: string) {
    return this.roomsService.getRoomReservation(id);
  }

  @Get(':id/summary')
  getRoomSummary(@Param('id') id: string) {
    return this.roomsService.getRoomSummary(id);
  }
}
