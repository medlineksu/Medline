import { Module } from "@nestjs/common";
import { DonationPostResolver } from "./donation_post.resolver";
import { DonationPostService } from "./donation_post.service";

@Module({
    providers: [DonationPostService, DonationPostResolver]
})
export class DonationPostModule {}