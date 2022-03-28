import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { DonationPostModule } from './donation_posts/donation_post.module';
import { HelpPostModule } from './help_post/help_post.module';
import { MedicinePostModule } from './medicine_posts/medicine_post.module';
import { PrismaModule } from './prisma/prisma.module';
import { TokensModule } from './tokens/tokens.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true }),
    PrismaModule,
    GraphQLModule.forRoot({ autoSchemaFile: join(process.cwd(), 'src/schema.gql'), installSubscriptionHandlers: true }),
    UploadsModule,
    UsersModule,
    TokensModule,
    AuthModule,
    DonationPostModule,
    MedicinePostModule,
    HelpPostModule,
  ],
})
export class AppModule { }
