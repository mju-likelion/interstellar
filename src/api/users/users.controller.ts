import { Controller, Post, Body, Req, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 예약 가능 시간 한번에 넘기는걸로, 응답에 JWT도 들어가야함.
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.usersService.createAppointement(createAppointmentDto);
  }

  // header에 JWT 넘어와야함
  @UseGuards(AuthGuard('jwt'))
  @Patch()
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.userId, updateUserDto);
  }
}
