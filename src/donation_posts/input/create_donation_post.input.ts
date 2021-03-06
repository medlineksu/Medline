import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsEnum, IsJWT, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { BloodType, DonationPostType } from "../donation_post.entity";

@InputType()
export class CreateDonationPostInput {
    @IsOptional()
    @IsJWT()
    @Field({nullable: true})
    accessToken?: string;

    @IsNotEmpty()
    @IsString()
    @Length(5, 10000)
    @Field()
    content: string;

    @IsNotEmpty()
    @IsString()
    @Length(5, 10000)
    @Field()
    address: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(BloodType)
    @Field()
    bloodType: BloodType;

    @IsNotEmpty()
    @IsString()
    @IsEnum(DonationPostType)
    @Field()
    type: DonationPostType;

    @IsNotEmpty()
    @IsBoolean()
    @Field()
    showPhoneNumber: boolean;

    // @IsNotEmpty()
    // @IsString()
    // @IsUUID()
    // @Field()
    // userId: string;
}