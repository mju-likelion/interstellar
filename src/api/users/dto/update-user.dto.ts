import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  username: string;

  @IsOptional()
  @IsBoolean()
  dateOnly: boolean;

  @IsString({ each: true })
  dates: string[];
}
