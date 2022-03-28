import { Module } from '@nestjs/common';
import { HelpPostResolver } from './help_post.resolver';
import { HelpPostService } from './help_post.service';

@Module({
    providers: [HelpPostService, HelpPostResolver],
})
export class HelpPostModule {}
