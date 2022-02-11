import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsNumberString, IsPhoneNumber, Length } from "class-validator";

@InputType()
export class LoginInput {
    @IsNotEmpty()
    @IsPhoneNumber()
    @Field()
    phoneNumber: string;

    @IsNotEmpty()
    @IsNumberString()
    @Length(6, 6)
    @Field()
    confirmationCode: string;
}