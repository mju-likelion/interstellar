import { Matches } from 'class-validator';

export class FindOneRoomParamDto {
  @Matches(/^[A-Z\d]{6}$/)
  code: string;
}
