import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { MedicinePost, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { FetchMedicinePostInput, FetchMedicinePostsInput } from './input';

@Injectable()
export class MedicinePostService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchMedicinePosts(
    input: FetchMedicinePostsInput,
  ): Promise<MedicinePost[]> {
    const { skip, take, cursor, type } = input;
    const posts: MedicinePost[] =
      await this.prismaService.medicinePost.findMany({
        skip,
        take,
        cursor: cursor ? { id: cursor } : undefined,
        where: { type },
      });
    return posts;
  }

  async fetchMedicinePost(
    input: FetchMedicinePostInput,
  ): Promise<MedicinePost> {
    const post: MedicinePost = await this.prismaService.medicinePost.findFirst({
      where: { id: input.id },
    });
    return post;
  }

  async createMedicinePost(input): Promise<MedicinePost> {
    const { accessToken, user, ...data } = input;
    const post: MedicinePost = await this.prismaService.medicinePost.create({
      data: { ...data, userId: user.id },
    });
    return post;
  }

  async updateMedicinePost(input): Promise<MedicinePost> {
    const { id, accessToken, user, ...data } = input;
    const post: MedicinePost = await this.prismaService.medicinePost.findUnique(
      { where: { id } },
    );
    if (post) {
      if (post.userId === user.id) {
        const post: MedicinePost = await this.prismaService.medicinePost.update(
          { where: { id }, data },
        );
        return post;
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  async deleteMedicinePost(input): Promise<MedicinePost> {
    const post: MedicinePost = await this.prismaService.medicinePost.findUnique(
      { where: { id: input.id } },
    );
    if (post) {
      if (input.user.id === post.userId) {
        const deletedPost = await this.prismaService.medicinePost.delete({
          where: { id: input.id },
        });
        return deletedPost;
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  async fetchPostUser(medicinePost: MedicinePost): Promise<User> {
    const user: User = await this.prismaService.user.findUnique({
      where: { id: medicinePost.userId },
    });
    if (!medicinePost.showPhoneNumber) user.phoneNumber = '+xxxxxxxxxxxx';
    return user;
  }
}
