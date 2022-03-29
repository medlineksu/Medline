import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsJWT,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { BloodType, DonationPostType } from '../donation_post.entity';

@InputType()
export class UpdateDonationPostInput {
  @IsOptional()
  @IsJWT()
  @Field({ nullable: true })
  accessToken?: string;

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
  @IsEnum(BloodType)
  @Field({ nullable: true })
  bloodType?: string;

  @IsOptional()
  @IsEnum(DonationPostType)
  @Field({ nullable: true })
  type?: string;
}
