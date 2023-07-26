import { IsString } from 'class-validator';

export class GetUserNameDto {
  @IsString()
  username: string;
}
