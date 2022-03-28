import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

@InputType()
export class CreateHelpPostInput {
  // @IsNotEmpty()
  // @IsJWT()
  // @Field()
  // accessToken: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 10000)
  @Field()
  content: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 10000)
  @Field()
  address: string;

  @IsOptional()
  @IsString()
  @Matches(/^[+-]?([0-9]*[.])?[0-9]+,[+-]?([0-9]*[.])?[0-9]+/)
  @Field({ nullable: true })
  location?: string;

  @IsNotEmpty()
  @IsBoolean()
  @Field()
  showPhoneNumber: boolean;

  // @IsNotEmpty()
  // @IsString()
  // @IsUUID()
  // @Field()
  // userId: string;
}
