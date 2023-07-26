import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  roomCode: string;

  @IsString()
  username: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  // @Matches(/^[A-Za-z0-9!@#$%^&*()]{8,30}$/)
  password: string;

  @IsOptional()
  @IsBoolean()
  dateOnly?: boolean;

  @IsString({ each: true })
  dates: string[];
}
