import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

/**
 * This will be displayed as enumeration rather than a list of strings
 * Available Values:
 * {offer,
 * request}
 * @enum
 */
export enum MedicinePostType {
  offer = 'offer',
  request = 'request',
}

@ObjectType()
export class MedicinePost {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field()
  address: string;

  @Field()
  showPhoneNumber: boolean;

  @Field()
  type: string;

  @Field()
  photo: string;

  @Field()
  userId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field((type) => User)
  user?: User;
}
