import { Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsOptional } from "class-validator";
import { BloodType, DonationPostType } from "../donation_post.entity";

@InputType()
export class DonationPostAddedInput {
    // @IsNotEmpty()
    // @IsJWT()
    // @Field()
    // accessToken: string;

    @IsOptional()
    @IsEnum(DonationPostType)
    @Field({ nullable: true })
    type: string;

    @IsOptional()
    @IsEnum(BloodType)
    @Field({ nullable: true })
    bloodType: string;
}