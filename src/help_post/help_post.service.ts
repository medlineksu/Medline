import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/user.entity';
import { HelpPost } from './entities/help_post.entity';
import { FetchHelpPostsInput } from './input';
import { FetchHelpPostInput } from './input/fetch_help_post.input';

@Injectable()
export class HelpPostService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchHelpPosts(input: FetchHelpPostsInput): Promise<HelpPost[]> {
    const { skip, take, cursor } = input;
    const posts: HelpPost[] = await this.prismaService.helpPost.findMany({
      skip,
      take,
      cursor: cursor ? { id: cursor } : undefined,
    });
    return posts;
  }

  async fetchHelpPost(input: FetchHelpPostInput): Promise<HelpPost> {
    const post: HelpPost = await this.prismaService.helpPost.findFirst({
      where: { id: input.id },
    });
    return post;
  }

  async createHelpPost(input): Promise<HelpPost> {
    const { accessToken, user, ...data } = input;
    const post: HelpPost = await this.prismaService.helpPost.create({
      data: { ...data, userId: user.id },
    });
    return post;
  }

  async updateHelpPost(input): Promise<HelpPost> {
    const { id, accessToken, user, ...data } = input;
    const post: HelpPost = await this.prismaService.helpPost.findUnique({
      where: { id },
    });
    if (post) {
      if (post.userId === user.id) {
        const post: HelpPost = await this.prismaService.helpPost.update({
          where: { id },
          data,
        });
        return post;
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  async deleteHelpPost(input): Promise<HelpPost> {
    const post: HelpPost = await this.prismaService.helpPost.findUnique({
      where: { id: input.id },
    });
    if (post) {
      if (input.user.id === post.userId) {
        const deletedPost = await this.prismaService.helpPost.delete({
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

  async fetchPostUser(helpPost: HelpPost): Promise<User> {
    const user: User = await this.prismaService.user.findUnique({
      where: { id: helpPost.userId },
    });
    if (!helpPost.showPhoneNumber) user.phoneNumber = '+xxxxxxxxxxxx';
    return user;
  }
}
