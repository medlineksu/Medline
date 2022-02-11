import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

/**
 * @module
 * According to how `Prisma` works, we need the `PrismaService` to connect and disconnect with the database
 * thus we need to make it available everywhere and that's why I've created this global module
 * just to export the `PrismaService` class to the rest of the application
 */
@Global()
@Module({ providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule { }