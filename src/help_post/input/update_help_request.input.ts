import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

@InputType()
export class UpdateHelpPostInput {
  // @IsNotEmpty()
  // @IsJWT()
  // @Field()
  // accessToken: string;

  @IsNotEmpty()
  @IsUUID()
  @Field()
  id: string;

  @IsOptional()
  @Field({ nullable: true })
  content?: string;

  @IsOptional()
  @Field({ nullable: true })
  address?: string;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  showPhoneNumber?: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^[+-]?([0-9]*[.])?[0-9]+,[+-]?([0-9]*[.])?[0-9]+/)
  @Field({ nullable: true })
  location?: string;
}
