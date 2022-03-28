import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsNumberString, IsPhoneNumber, Length } from "class-validator";

@InputType()
export class LoginInput {
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