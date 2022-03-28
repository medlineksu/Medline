import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class HelpPost {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field()
  address: string;

  @Field()
  showPhoneNumber: boolean;

  @Field({ nullable: true })
  location?: string;

  @Field()
  userId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(type => User)
  user?: User;
}
