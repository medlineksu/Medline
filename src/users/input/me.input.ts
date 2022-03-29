import { Field, InputType } from '@nestjs/graphql';
import { IsJWT, IsOptional } from 'class-validator';

@InputType()
export class MeInput {
  @IsOptional()
  @IsJWT()
  @Field({ nullable: true })
  accessToken?: string;
}
