import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class UpdateUserInput {
    // @IsNotEmpty()
    // @IsJWT()
    // @Field()
    // accessToken: string;

    // @IsNotEmpty()
    // @IsUUID()
    // @Field()
    // id: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    name: string;

    // @IsOptional()
    // @IsPhoneNumber()
    // @Field({ nullable: true })
    // phoneNumber?: string;
}