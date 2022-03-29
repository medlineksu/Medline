import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsJWT,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { BloodType, DonationPostType } from '../donation_post.entity';

@InputType()
export class FetchDonationPostsInput {
  @IsOptional()
  @IsJWT()
  @Field({ nullable: true })
  accessToken?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field((type) => Int, { defaultValue: 0 })
  skip: number = 0;

  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(50)
  @Field((type) => Int, { defaultValue: 10 })
  take: number = 10;

  @IsOptional()
  @IsString()
  @IsUUID()
  @Field({ nullable: true })
  cursor?: string;

  @IsOptional()
  @IsEnum(DonationPostType)
  @Field({ nullable: true })
  type?: string;

  @IsOptional()
  @IsEnum(BloodType)
  @Field({ nullable: true })
  bloodType?: string;
}
