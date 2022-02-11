import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsPhoneNumber } from "class-validator";

@InputType()
export class SendSmsInput {
    @IsNotEmpty()
    @IsPhoneNumber()
    @Field()
    phoneNumber: string;
}