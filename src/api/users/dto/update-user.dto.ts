import { PartialType } from '@nestjs/mapped-types';

import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateUserDto extends PartialType(CreateAppointmentDto) {}
