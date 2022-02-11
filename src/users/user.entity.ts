import { Field, ObjectType } from "@nestjs/graphql";
import { DonationPost } from "src/donation_posts/donation_post.entity";

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

    @Field(type => [DonationPost])
    donationPosts?: DonationPost[];
}