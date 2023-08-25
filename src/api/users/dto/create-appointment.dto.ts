import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  roomCode: string;

  @IsString()
  username: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  // @Matches(/^[A-Za-z0-9!@#$%^&*()]{8,30}$/)
  password: string;

  @IsString({ each: true })
  dates: string[];
}
