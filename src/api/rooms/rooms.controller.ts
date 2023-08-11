import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import {
  FindOneRoomParamDto,
  GetRoomResultByDateParamDto,
} from './dto/room-param.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get(':code')
  findOne(@Param() { code }: FindOneRoomParamDto) {
    return this.roomsService.findOne(code);
  }

  @Get(':code/result')
  getResult(@Param() { code }: FindOneRoomParamDto) {
    return this.roomsService.getResult(code);
  }
}
