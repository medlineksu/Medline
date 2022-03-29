import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsJWT,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { MedicinePostType } from '../entities/medicine_post.entity';

@InputType()
export class UpdateMedicinePostInput {
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
  @IsString()
  @IsUrl()
  @Field({ nullable: true })
  photo?: string;

  @IsOptional()
  @IsEnum(MedicinePostType)
  @Field({ nullable: true })
  type?: string;
}
