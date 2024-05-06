import { Field, ID, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class FindOneDto {
  @Field(() => ID)
  @IsMongoId()
  @IsString()
  id: string;
}
