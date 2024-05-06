import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserDto {
  @Field(() => String)
  @IsString()
  @MinLength(3)
  nombre?: string;

  @Field(() => String)
  @IsString()
  @MinLength(3)
  cedula?: string;

  @Field(() => String)
  @IsString()
  @MinLength(3)
  telefono?: string;

  accion?: string;

  id_telegram: number;

  activo?: boolean;
}
