import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../users/user.entity";

/**
 * This will be displayed as enumeration rather than a list of strings
 * Available Values:
 * {aPlus,
 * aMinus,
 * bPlus,
 * bMinus,
 * oPlus,
 * oMinus,
 * abPlus,
 * abMinus}
 * @enum
 */
export enum BloodType {
    aPlus = 'aPlus',
    aMinus = 'aMinus',
    bPlus = 'bPlus',
    bMinus = 'bMinus',
    oPlus = 'oPlus',
    oMinus = 'oMinus',
    abPlus = 'abPlus',
    abMinus = 'abMinus'
}

/**
 * This will be displayed as enumeration rather than a list of strings
 * Available Values:
 * {offer,
 * request}
 * @enum
 */
export enum DonationPostType {
    offer = 'offer',
    request = 'request',
}

/**
 * @param type is marked as string although it's an enum
 * because this will give us flexibility with the database
 * and it will be validated by the class-validator anyway so
 * we're all good'
 * 
 * @param user is just for GraphQL and doesn't represent any
 * stored data in the `DonationPost` entity
 */
@ObjectType()
export class DonationPost {
    @Field()
    id: string;

    @Field()
    content: string;

    @Field()
    address: string;

    @Field()
    showPhoneNumber: boolean;

    @Field()
    type: string;

    @Field()
    bloodType: string;

    @Field()
    userId: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field(type => User)
    user?: User;
}