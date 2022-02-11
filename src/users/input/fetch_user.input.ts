import { Field, InputType } from "@nestjs/graphql";
import { IsJWT, IsNotEmpty, IsOptional, IsPhoneNumber, IsUUID } from "class-validator";

@InputType()
export class FetchUserInput {
    @IsNotEmpty()
    @IsJWT()
    @Field()
    accessToken: string;

    @IsOptional()
    @IsUUID()
    @Field({ nullable: true })
    id?: string;

    @IsOptional()
    @IsPhoneNumber()
    @Field({ nullable: true })
    phoneNumber?: string;
}