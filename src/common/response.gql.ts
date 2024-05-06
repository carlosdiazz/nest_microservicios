import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResponsePropioGQl {
  @Field(() => String)
  message: string;

  @Field(() => Boolean)
  error: boolean;
}
