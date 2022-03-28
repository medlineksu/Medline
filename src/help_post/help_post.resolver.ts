import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { IsAuthenticated } from 'src/auth/guards/is_authenticated.guard';
import { User } from 'src/users/entities/user.entity';
import { HelpPost } from './entities/help_post.entity';
import { HelpPostService } from './help_post.service';
import {
  CreateHelpPostInput,
  DeleteHelpPostInput,
  FetchHelpPostInput,
  FetchHelpPostsInput,
  HelpPostAddedInput,
  UpdateHelpPostInput,
} from './input';

@UseGuards(IsAuthenticated)
@Resolver((of) => HelpPost)
export class HelpPostResolver {
  private pubSub: PubSub = new PubSub();
  static helpPostAdded: string = 'helpPostAdded';

  constructor(private helpPostService: HelpPostService) {}

  @Query((returns) => [HelpPost])
  async helpPosts(
    @Args('input') input: FetchHelpPostsInput,
  ): Promise<HelpPost[]> {
    return await this.helpPostService.fetchHelpPosts(input);
  }

  @Query((returns) => HelpPost)
  async helpPost(@Args('input') input: FetchHelpPostInput): Promise<HelpPost> {
    return await this.helpPostService.fetchHelpPost(input);
  }

  /**
   * This function will validate and add a new help post record to the database
   * and the sends a signal to `pubSub` notifiying it about the newly created
   * help post record in the database
   */
  @Mutation((returns) => HelpPost)
  async createHelpPost(
    @Args('input') input: CreateHelpPostInput,
  ): Promise<HelpPost> {
    const helpPost: HelpPost = await this.helpPostService.createHelpPost(
      input,
    );
    this.pubSub.publish(HelpPostResolver.helpPostAdded, {
      helpPostAdded: helpPost,
    });
    return helpPost;
  }

  /**
   * Validates the `input` data and checks if the help post record exists in the database
   * and if it was found, it will check if the user that triggered the request is the owner of
   * the help post record in the database
   */
  @Mutation((returns) => HelpPost)
  async updateHelpPost(
    @Args('input') input: UpdateHelpPostInput,
  ): Promise<HelpPost> {
    return await this.helpPostService.updateHelpPost(input);
  }

  /**
   * Validates the `input` data and checks if the help post record exists in the database
   * and if it was found, it will check if the user that triggered the request is the owner of
   * the help post record in the database
   */
  @Mutation((returns) => HelpPost)
  async deleteHelpPost(
    @Args('input') input: DeleteHelpPostInput,
  ): Promise<HelpPost> {
    return await this.helpPostService.deleteHelpPost(input);
  }

  @ResolveField((returns) => User)
  async user(@Parent() helpPost: HelpPost): Promise<User> {
    return await this.helpPostService.fetchPostUser(helpPost);
  }

  /**
   * This function contains the help posts realtime functionality logic.
   * @filter function is responsible for sending the right data to the user
   * as requested in the input.
   */
  @Subscription((returns) => HelpPost, {
    name: HelpPostResolver.helpPostAdded,
  })
  async helpPostAdded(@Args('input') input: HelpPostAddedInput) {
    return this.pubSub.asyncIterator(HelpPostResolver.helpPostAdded);
  }
}
