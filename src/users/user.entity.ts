import { Field, ObjectType } from "@nestjs/graphql";
import { DonationPost } from "src/donation_posts/donation_post.entity";
import { HelpPost } from "src/help_post/entities/help_post.entity";
import { MedicinePost } from "src/medicine_posts/entities/medicine_post.entity";

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

    @Field(type => [MedicinePost])
    medicinePosts?: MedicinePost[];

    @Field(type => [HelpPost])
    helpPosts?: HelpPost[];
}