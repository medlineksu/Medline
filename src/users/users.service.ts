import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserInput } from "./input/create_user.input";
import { FetchUserInput } from "./input/fetch_user.input";
import { FetchUsersInput } from "./input/fetch_users.input";


@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) { }

    async fetchUsers(input: FetchUsersInput): Promise<User[]> {
        const { cursor, take, skip } = input;
        const users: User[] = await this.prismaService.user.findMany({ skip, take, cursor: cursor ? { id: cursor } : undefined });
        return users;
    }

    async fetchUser(input: FetchUserInput): Promise<User> {
        const user: User = await this.prismaService.user.findUnique({ where: input });
        return user;
    }

    async createUser(input: CreateUserInput): Promise<User> {
        const user: User = await this.prismaService.user.create({ data: input });
        return user;
    }

    async updateUser(input): Promise<User> {
        const { user, accessToken, ...data } = input;
        const updatedUser: User = await this.prismaService.user.update({ where: { id: user.id }, data });
        return updatedUser;
    }

    async deleteUser(input): Promise<User> {
        const { user } = input
        const deletedUser: User = await this.prismaService.user.delete({ where: { id: user.id } });
        return deletedUser;
    }
}