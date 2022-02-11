import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsUUID } from "class-validator";

@InputType()
export class LogoutInput {
    @IsNotEmpty()
    @IsUUID()
    @Field()
    accessToken: string;
}