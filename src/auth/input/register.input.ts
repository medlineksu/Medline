import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

@InputType()
export class RegisterInput {
  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  @Field()
  name: string;

  @IsNotEmpty()
  @IsPhoneNumber('EG')
  @Length(13, 13)
  @Field()
  phoneNumber: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6)
  @Field()
  confirmationCode: string;
}
