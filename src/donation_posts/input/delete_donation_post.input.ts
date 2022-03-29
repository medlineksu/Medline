import { Field, InputType } from '@nestjs/graphql';
import { IsJWT, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class DeleteDonationPostInput {
  @IsOptional()
  @IsJWT()
  @Field({ nullable: true })
  accessToken?: string;

  @IsNotEmpty()
  @IsUUID()
  @Field()
  id: string;
}
