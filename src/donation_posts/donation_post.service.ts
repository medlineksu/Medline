import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { DonationPost } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "src/users/entities/user.entity";
import { FetchDonationPostInput } from "./input/fetch_donation_post.input";
import { FetchDonationPostsInput } from "./input/fetch_donation_posts.input";

@Injectable()
export class DonationPostService {
    constructor(private readonly prismaService: PrismaService) { }

    async fetchDonationPosts(input: FetchDonationPostsInput): Promise<DonationPost[]> {
        const { skip, take, cursor, bloodType, type } = input;
        const posts: DonationPost[] = await this.prismaService.donationPost.findMany({ skip, take, cursor: cursor ? { id: cursor } : undefined, where: { bloodType, type } });
        return posts;
    }

    async fetchDonationPost(input: FetchDonationPostInput): Promise<DonationPost> {
        const post: DonationPost = await this.prismaService.donationPost.findFirst({ where: { id: input.id } });
        return post;
    }

    async createDonationPost(input): Promise<DonationPost> {
        const { accessToken, user, ...data } = input;
        const post: DonationPost = await this.prismaService.donationPost.create({ data: { ...data, userId: user.id } });
        return post;
    }

    async updateDonationPost(input): Promise<DonationPost> {
        const { id, accessToken, user, ...data } = input;
        const post: DonationPost = await this.prismaService.donationPost.findUnique({ where: { id } });
        if (post) {
            if (post.userId === user.id) {
                const post: DonationPost = await this.prismaService.donationPost.update({ where: { id }, data });
                return post;
            } else {
                throw new UnauthorizedException();
            }
        } else {
            throw new NotFoundException();
        }
    }

    async deleteDonationPost(input): Promise<DonationPost> {
        const post: DonationPost = await this.prismaService.donationPost.findUnique({ where: { id: input.id } });
        if (post) {
            if (input.user.id === post.userId) {
                const deletedPost = await this.prismaService.donationPost.delete({ where: { id: input.id } });
                return deletedPost;
            } else {
                throw new UnauthorizedException();
            }
        } else {
            throw new NotFoundException();
        }
    }

    async fetchPostUser(donationPost: DonationPost): Promise<User> {
        const user: User = await this.prismaService.user.findUnique({ where: { id: donationPost.userId } });
        if (!donationPost.showPhoneNumber) user.phoneNumber = "+xxxxxxxxxxxx";
        return user;
    }
}