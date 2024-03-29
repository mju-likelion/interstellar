import { IsBoolean, IsOptional, Matches } from 'class-validator';

export class CreateRoomDto {
  @Matches(/^(\d{4}-\d{2}-\d{2})$/, {
    each: true,
  })
  dates: string[];

  @IsOptional()
  @IsBoolean()
  dateOnly?: boolean;

  @IsOptional()
  @Matches(/^([01]\d|2[0-4]):([0-5]\d)$/)
  startTime?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-4]):([0-5]\d)$/)
  endTime?: string;
}
