import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Param,
  Request,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/auth.guard';

import { UsersService } from './users.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.usersService.createAppointment(createAppointmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':roomCode')
  update(
    @Request() req,
    @Param('roomCode') roomCode: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const user = req.user;
    return this.usersService.update(user, roomCode, updateUserDto);
  }
}
