import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsEnum, IsJWT, IsNotEmpty, IsString } from "class-validator";
import { BloodType, DonationPostType } from "../donation_post.entity";

@InputType()
export class CreateDonationPostInput {
    @IsNotEmpty()
    @IsJWT()
    @Field()
    accessToken: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    content: string;

    @IsNotEmpty()
    @IsString()
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