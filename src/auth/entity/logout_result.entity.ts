import { Field, ObjectType } from "@nestjs/graphql";

export enum LogoutResultStatus {
    success = "success",
    fail = "fail",
}

@ObjectType()
export class LogoutResult {
    @Field()
    status: LogoutResultStatus;
}