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
    const rawHeaders = ctx.getContext().req.rawHeaders;
    let accessToken: string;
    for (let value of rawHeaders) {
      if (value === 'Authorization') {
        const index = rawHeaders.indexOf(value);
        const authHeader = rawHeaders[index + 1];
        if (authHeader.startsWith('Bearer')) {
          accessToken = authHeader.split(' ')[1];
          break;
        }
      }
    }
    if (accessToken) {
      const input = ctx.getArgs().input;
      const user: User = await this.tokensService.getUserFromAccessToken(accessToken);
      input.user = user;
      return true;
    }
    return false;
  }
}
