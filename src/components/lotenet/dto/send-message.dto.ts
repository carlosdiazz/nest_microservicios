import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MinLength,
} from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly contacto: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  readonly header: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  readonly body: string;
}

export class VerifyContactDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @IsNumberString()
  readonly contacto: string;
}
