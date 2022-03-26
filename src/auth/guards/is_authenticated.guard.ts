import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TokensService } from 'src/tokens/tokens.service';
import { User } from 'src/users/user.entity';

/**
 * @guard
 * This guard is responsible for verifying the access token sent with each request
 * and finding the user behind that request and then fetching its data from the database
 * and injecting it into the request input object
 */
@Injectable()
export class IsAuthenticated implements CanActivate {
  constructor(private readonly tokensService: TokensService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const args = ctx.getArgs();
    const input = args.input;
    let accessToken: string;
    if (input) {
      if (input.accessToken) {
        accessToken = input.accessToken;
      } else {
        const req = ctx.getContext().req;
        const rawHeaders = req.rawHeaders as Array<string>;
        if (rawHeaders.includes('Authorization')) {
          const index = rawHeaders.indexOf('Authorization');
          const authHeader = rawHeaders[index + 1];
          if (authHeader.startsWith('Bearer')) {
            accessToken = authHeader.split(' ')[1];
          }
        }
      }
    }
    if (accessToken) {
      const input = ctx.getArgs().input;
      const user: User = await this.tokensService.getUserFromAccessToken(
        accessToken,
      );
      input.user = user;
      return true;
    }
    return false;
  }
}
