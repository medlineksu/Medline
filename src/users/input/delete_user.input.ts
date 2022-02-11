import { Field, InputType } from "@nestjs/graphql";
import { IsJWT, IsNotEmpty } from "class-validator";

@InputType()
export class DeleteUserInput {
    @IsNotEmpty()
    @IsJWT()
    @Field()
    accessToken: string;
    
    // @IsNotEmpty()
    // @IsUUID()
    // @Field()
    // id: string;
}