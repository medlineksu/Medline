import { Field, InputType } from "@nestjs/graphql";
import { IsJWT, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

@InputType()
export class FetchDonationPostInput {
    @IsOptional()
    @IsJWT()
    @Field({nullable: true})
    accessToken?: string;

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