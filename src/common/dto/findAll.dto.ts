import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

@InputType()
export class PaginationDto {
  @Field(() => Int)
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number) //Aqui transformo els tring a numero
  limit?: number = 10;

  @Field(() => Int)
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number) //Aqui transformo els tring a numero
  page?: number = 1;
}
