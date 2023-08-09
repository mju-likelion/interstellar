import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserNameDto } from './dto/get-user-name.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.usersService.createAppointment(createAppointmentDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':roomCode')
  update(
    @Param('roomCode') roomCode: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(roomCode, updateUserDto);
  }
}
