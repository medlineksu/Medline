import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsPhoneNumber, IsUUID } from "class-validator";

/**
 * This just takes an id and a phone number and used to simulate the
 * login process for testing purposes
 */
@InputType()
export class FakeLoginInput {
    @IsNotEmpty()
    @IsUUID()
    @Field()
    id: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    @Field()
    phoneNumber: string;
}