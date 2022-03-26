import { Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsJWT, IsNotEmpty, IsOptional } from "class-validator";
import { MedicinePostType } from "../entities/medicine_post.entity";

@InputType()
export class MedicinePostAddedInput {
    @IsNotEmpty()
    @IsJWT()
    @Field()
    accessToken: string;

    @IsOptional()
    @IsEnum(MedicinePostType)
    @Field({ nullable: true })
    type: string;
}