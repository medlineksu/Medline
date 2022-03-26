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
import { User } from 'src/users/user.entity';
import { MedicinePost } from './entities/medicine_post.entity';
import {
  CreateMedicinePostInput,
  DeleteMedicinePostInput,
  FetchMedicinePostInput,
  FetchMedicinePostsInput,
  UpdateMedicinePostInput,
} from './input';
import { MedicinePostAddedInput } from './input/medicine_post_added.input';
import { MedicinePostService } from './medicine_post.service';

@UseGuards(IsAuthenticated)
@Resolver((of) => MedicinePost)
export class MedicinePostResolver {
  private pubSub: PubSub = new PubSub();
  static medicinePostAdded: string = 'medicinePostAdded';

  constructor(private readonly medicinePostService: MedicinePostService) {}

  @Query((returns) => [MedicinePost])
  async medicinePosts(
    @Args('input') input: FetchMedicinePostsInput,
  ): Promise<MedicinePost[]> {
    return await this.medicinePostService.fetchMedicinePosts(input);
  }

  @Query((returns) => MedicinePost)
  async medicinePost(
    @Args('input') input: FetchMedicinePostInput,
  ): Promise<MedicinePost> {
    return await this.medicinePostService.fetchMedicinePost(input);
  }

  /**
   * This function will validate and add a new medicine post record to the database
   * and the sends a signal to `pubSub` notifiying it about the newly created
   * medicine post record in the database
   */
  @Mutation((returns) => MedicinePost)
  async createMedicinePost(
    @Args('input') input: CreateMedicinePostInput,
  ): Promise<MedicinePost> {
    const medicinePost: MedicinePost =
      await this.medicinePostService.createMedicinePost(input);
    this.pubSub.publish(MedicinePostResolver.medicinePostAdded, {
      medicinePostAdded: medicinePost,
    });
    return medicinePost;
  }

  /**
   * Validates the `input` data and checks if the medicine post record exists in the database
   * and if it was found, it will check if the user that triggered the request is the owner of
   * the medicine post record in the database
   */
  @Mutation((returns) => MedicinePost)
  async updateMedicinePost(
    @Args('input') input: UpdateMedicinePostInput,
  ): Promise<MedicinePost> {
    return await this.medicinePostService.updateMedicinePost(input);
  }

  /**
   * Validates the `input` data and checks if the medicine post record exists in the database
   * and if it was found, it will check if the user that triggered the request is the owner of
   * the medicine post record in the database
   */
  @Mutation((returns) => MedicinePost)
  async deleteMedicinePost(
    @Args('input') input: DeleteMedicinePostInput,
  ): Promise<MedicinePost> {
    return await this.medicinePostService.deleteMedicinePost(input);
  }

  @ResolveField((returns) => User)
  async user(@Parent() medicinePost: MedicinePost): Promise<User> {
    return await this.medicinePostService.fetchPostUser(medicinePost);
  }

  /**
   * This function contains the medicine posts realtime functionality logic.
   * @filter function is responsible for sending the right data to the user
   * as requested in the input.
   */
  @Subscription((returns) => MedicinePost, {
    name: MedicinePostResolver.medicinePostAdded,
    filter: async (payload, variables) => {
      const input = variables.input;
      const addedMedicinePost = payload.medicinePostAdded;
      if (input.type) {
        if (input.type !== addedMedicinePost.type) {
          return false;
        }
      }
      return true;
    },
  })
  async medicinePostAdded(@Args('input') input: MedicinePostAddedInput) {
    return this.pubSub.asyncIterator(MedicinePostResolver.medicinePostAdded);
  }
}
