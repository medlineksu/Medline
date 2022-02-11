import { Field, InputType } from "@nestjs/graphql";
import { IsJWT, IsNotEmpty, IsUUID } from "class-validator";

@InputType()
export class DeleteDonationPostInput {
    @IsNotEmpty()
    @IsJWT()
    @Field()
    accessToken: string;

    @IsNotEmpty()
    @IsUUID()
    @Field()
    id: string;
}