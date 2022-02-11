import { Field, ObjectType } from "@nestjs/graphql";

export enum SendSmsResultOperationType {
    login = 'login',
    register = 'register',
}

export enum SendSmsResultStatus {
    success = 'success',
    fail = 'fail',
}

@ObjectType()
export class SendSmsResult {
    @Field()
    operation: SendSmsResultOperationType;

    @Field()
    status: SendSmsResultStatus;
}