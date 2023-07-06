import { IsBoolean, IsOptional, Matches } from 'class-validator';

export class CreateRoomDto {
  @Matches(/^(\d{4}-\d{2}-\d{2},?)+$/, {
    message:
      '올바른 날짜 형식이 아닙니다. 다음 형식을 지켜주세요. (YYYY-MM-DD,YYYY-MM-DD,...)',
  })
  dates: string;

  @IsOptional()
  @IsBoolean({
    message: 'dateOnly는 boolean 형식이어야 합니다.',
  })
  dateOnly?: boolean;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: '올바른 시간 형식이 아닙니다. 다음 형식을 지켜주세요. (HH:MM)',
  })
  startTime?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: '올바른 시간 형식이 아닙니다. 다음 형식을 지켜주세요. (HH:MM)',
  })
  endTime?: string;
}
