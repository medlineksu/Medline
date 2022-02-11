import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString, IsPhoneNumber, IsString, Length } from "class-validator";

@InputType()
export class RegisterInput {
    @IsNotEmpty()
    @IsString()
    @Field()
    name: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    @Field()
    phoneNumber: string;

    @IsNotEmpty()
    @IsNumberString()
    @Length(6,6)
    @Field()
    confirmationCode: string;
}