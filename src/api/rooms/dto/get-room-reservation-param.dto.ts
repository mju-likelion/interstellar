import { Matches } from 'class-validator';

export class GetRoomReservationParamDto {
  @Matches(/^[A-Z\d]{6}$/)
  code: string;
}
