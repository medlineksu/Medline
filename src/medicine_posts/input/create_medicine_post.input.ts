import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsEnum, IsNotEmpty, IsString, IsUrl, Length } from "class-validator";
import { MedicinePostType } from "../entities/medicine_post.entity";

@InputType()
export class CreateMedicinePostInput {
    // @IsNotEmpty()
    // @IsJWT()
    // @Field()
    // accessToken: string;

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
    @IsUrl()
    @Field()
    photo: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(MedicinePostType)
    @Field()
    type: string;

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