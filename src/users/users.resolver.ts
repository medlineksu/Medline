import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Args } from "@nestjs/graphql";
import { IsAuthenticated } from "src/auth/guards/is_authenticated.guard";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { MeInput } from "./input/me.input";

@UseGuards(IsAuthenticated)
@Resolver(of => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    // @Query(returns => [User])
    // async users(@Args('input') input: FetchUsersInput) : Promise<User[]> {
    //     return await this.usersService.fetchUsers(input);
    // }

    // @Query(returns => User)
    // async user(@Args('input') input: FetchUserInput): Promise<User> {
    //     return await this.usersService.fetchUser(input);
    // }

    @Query(returns => User)
    async me(@Args('input') input: MeInput): Promise<User> {
        return await this.usersService.me(input);
    }

    // @Mutation(returns => User)
    // async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    //     return await this.usersService.createUser(input);
    // }

    // @Mutation(returns => User)
    // async updateUser(@Args('input') input: UpdateUserInput): Promise<User> {
    //     return await this.usersService.updateUser(input);
    // }

    // @Mutation(returns => User)
    // async deleteUser(@Args('input') input: UpdateUserInput): Promise<User> {
    //     return await this.usersService.deleteUser(input);
    // }
}