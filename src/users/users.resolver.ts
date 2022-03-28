import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { IsAuthenticated } from "src/auth/guards/is_authenticated.guard";
import { FetchUserInput } from "./input/fetch_user.input";
import { UpdateUserInput } from "./input/update_user.input";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

@Resolver(of => User)
@UseGuards(IsAuthenticated)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    // @Query(returns => [User])
    // async users(@Args('input') input: FetchUsersInput) : Promise<User[]> {
    //     return await this.usersService.fetchUsers(input);
    // }

    @Query(returns => User)
    async user(@Args('input') input: FetchUserInput): Promise<User> {
        return await this.usersService.fetchUser(input);
    }

    // @Mutation(returns => User)
    // async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    //     return await this.usersService.createUser(input);
    // }

    @Mutation(returns => User)
    async updateUser(@Args('input') input: UpdateUserInput): Promise<User> {
        return await this.usersService.updateUser(input);
    }

    // @Mutation(returns => User)
    // async deleteUser(@Args('input') input: UpdateUserInput): Promise<User> {
    //     return await this.usersService.deleteUser(input);
    // }
}