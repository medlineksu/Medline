import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsJWT, IsNotEmpty, IsOptional, IsUUID, Max } from "class-validator";

/**
 * @param skip for pagination, default and minimum value is 0
 * @param take for pagination, default value is 10, maximumm value is 50
 * @param cursor for pagination and it's meant to represent the UUID of the object in the database where
 * the pagination should start from
 * 
 * All the pagination parameters are optional
 */
@InputType()
export class FetchUsersInput {
    @IsNotEmpty()
    @IsJWT()
    @Field()
    accessToken: string;

    @IsOptional()
    @IsInt()
    @Field(type => Int, { nullable: true })
    skip?: number;

    @IsOptional()
    @IsInt()
    @Max(50)
    @Field(type => Int, { nullable: true })
    take?: number;

    @IsOptional()
    @IsUUID()
    @Field({ nullable: true })
    cursor?: string;
}