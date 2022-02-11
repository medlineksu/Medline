import { Field, InputType } from "@nestjs/graphql";

/**
 * This was for testing purposes only and shouldn't be used in production
 */
@InputType()
export class CreateUserInput {
    @Field()
    name: string;

    @Field()
    phoneNumber: string;
}