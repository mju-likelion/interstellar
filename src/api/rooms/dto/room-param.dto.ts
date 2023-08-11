import { Matches } from 'class-validator';

export class FindOneRoomParamDto {
  @Matches(/^[A-Z\d]{6}$/)
  code: string;
}

export class GetRoomResultByDateParamDto {
  @Matches(/^[A-Z\d]{6}$/)
  code: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;
}
