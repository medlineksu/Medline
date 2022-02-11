import { Field, InputType } from "@nestjs/graphql";
import { IsJWT, IsNotEmpty, IsUUID } from "class-validator";

@InputType()
export class FetchDonationPostInput {
    @IsNotEmpty()
    @IsJWT()
    @Field()
    accessToken: string;

    @IsNotEmpty()
    @IsUUID()
    @Field()
    id?: string;

    // @IsOptional()
    // @IsString()
    // @Field({ nullable: true })
    // content?: string;

    // @IsOptional()
    // @IsString()
    // @Field({ nullable: true })
    // address?: string;
}