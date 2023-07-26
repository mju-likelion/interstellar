import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class GetUserNameDto {
  @IsString()
  username: string;
}
