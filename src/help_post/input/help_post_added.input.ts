import { Field, InputType } from '@nestjs/graphql';
import { IsJWT, IsNotEmpty } from 'class-validator';

@InputType()
export class HelpPostAddedInput {
  @IsNotEmpty()
  @IsJWT()
  @Field()
  accessToken: string;
}
