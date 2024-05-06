import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID) // Indica que es el ID de la entidad
  _id: string;

  @Prop({ default: null })
  @Field(() => String)
  nombre?: string;

  @Field(() => String)
  @Prop({ default: null })
  cedula?: string;

  @Field(() => String)
  @Prop({ default: null })
  telefono?: string;

  @Prop({ required: true, unique: true, type: 'number' })
  @Field(() => Int)
  id_telegram: number;

  @Prop({ default: null })
  accion?: string;

  @Prop({ default: false, required: true })
  activo: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
