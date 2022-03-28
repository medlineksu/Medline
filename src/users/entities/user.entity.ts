import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    phoneNumber: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    // @Field(type => [DonationPost])
    // donationPosts?: DonationPost[];

    // @Field(type => [MedicinePost])
    // medicinePosts?: MedicinePost[];

    // @Field(type => [HelpPost])
    // helpPosts?: HelpPost[];
}