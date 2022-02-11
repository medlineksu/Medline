import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DonationPostResolver } from "./donation_post.resolver";
import { DonationPostService } from "./donation_post.service";

@Module({
    imports: [PrismaService],
    providers: [DonationPostService, DonationPostResolver]
})
export class DonationPostModule {}