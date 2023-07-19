import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  roomCode: string;

  @IsString()
  userName: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @Matches(/^[A-Za-z0-9!@#$%^&*()]{8,30}$/)
  password: string;

  @IsOptional()
  @IsBoolean()
  dateOnly?: boolean;

  // @Transform(({ value }) => value.split(',').map(date => date.trim()))
  @IsString({ each: true })
  // @Matches(/^(\d{4}-\d{2}-\d{2}( \d{2}:\d{2})?,?)+$/)
  dates: string[];
}
