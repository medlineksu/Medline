import { UseGuards } from '@nestjs/common';
import {
  Args,
  Resolver,
  Query,
  Mutation,
  ResolveField,
  Parent,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { IsAuthenticated } from 'src/auth/guards/is_authenticated.guard';
import { User } from 'src/users/user.entity';
import { DonationPost } from './donation_post.entity';
import { DonationPostService } from './donation_post.service';
import { CreateDonationPostInput } from './input/create_donation_post.input';
import { DeleteDonationPostInput } from './input/delete_donation_post.input';
import { DonationPostAddedInput } from './input/donation_post_added.input';
import { FetchDonationPostInput } from './input/fetch_donation_post.input';
import { FetchDonationPostsInput } from './input/fetch_donation_posts.input';
import { UpdateDonationPostInput } from './input/update_donation_post.input';

/**
 * This class uses the `IsAuthenticated` guard on all of its routes
 * @param pubSub is responsible for the realtime functionality
 */
@UseGuards(IsAuthenticated)
@Resolver((of) => DonationPost)
export class DonationPostResolver {
  private pubSub: PubSub = new PubSub();
  static donationPostAdded: string = 'donationPostAdded';

  constructor(private readonly donationPostService: DonationPostService) {}

  @Query((returns) => [DonationPost])
  async donationPosts(
    @Args('input') input: FetchDonationPostsInput,
  ): Promise<DonationPost[]> {
    return await this.donationPostService.fetchDonationPosts(input);
  }

  @Query((returns) => DonationPost)
  async donationPost(
    @Args('input') input: FetchDonationPostInput,
  ): Promise<DonationPost> {
    return await this.donationPostService.fetchDonationPost(input);
  }

  /**
   * This function will validate and add a new donation post record to the database
   * and the sends a signal to `pubSub` notifiying it about the newly created
   * donation post record in the database
   */
  @Mutation((returns) => DonationPost)
  async createDonationPost(
    @Args('input') input: CreateDonationPostInput,
  ): Promise<DonationPost> {
    const donationPost: DonationPost =
      await this.donationPostService.createDonationPost(input);
    this.pubSub.publish(DonationPostResolver.donationPostAdded, {
      donationPostAdded: donationPost,
    });
    return donationPost;
  }

  /**
   * Validates the `input` data and checks if the donation post record exists in the database
   * and if it was found, it will check if the user that triggered the request is the owner of
   * the donation post record in the database
   */
  @Mutation((returns) => DonationPost)
  async updateDonationPost(
    @Args('input') input: UpdateDonationPostInput,
  ): Promise<DonationPost> {
    return await this.donationPostService.updateDonationPost(input);
  }

  /**
   * Validates the `input` data and checks if the donation post record exists in the database
   * and if it was found, it will check if the user that triggered the request is the owner of
   * the donation post record in the database
   */
  @Mutation((returns) => DonationPost)
  async deleteDonationPost(
    @Args('input') input: DeleteDonationPostInput,
  ): Promise<DonationPost> {
    return await this.donationPostService.deleteDonationPost(input);
  }

  @ResolveField((returns) => User)
  async user(@Parent() donationPost: DonationPost): Promise<User> {
    return await this.donationPostService.fetchPostUser(donationPost);
  }

  /**
   * This function contains the donation posts realtime functionality logic.
   * @filter function is responsible for sending the right data to the user
   * as requested in the input.
   */
  @Subscription((returns) => DonationPost, {
    name: DonationPostResolver.donationPostAdded,
    filter: async (payload, variables) => {
      const input = variables.input;
      const addedDonationPost = payload.donationPostAdded;
      if (input.type || input.bloodType) {
        if (input.type && input.type !== addedDonationPost.type) {
          return false;
        }
        if (
          input.bloodType &&
          input.bloodType !== addedDonationPost.bloodType
        ) {
          return false;
        }
      }
      return true;
    },
  })
  async donationPostAdded(@Args('input') input: DonationPostAddedInput) {
    return this.pubSub.asyncIterator(DonationPostResolver.donationPostAdded);
  }
}
