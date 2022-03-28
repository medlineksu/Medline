import { BadRequestException, CACHE_MANAGER, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Cache } from "cache-manager";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthTokens } from "src/auth/entity/auth_tokens.entity";
import { RefreshTokensInput } from "src/auth/input/refresh_tokens.input";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "src/users/entities/user.entity";

/**
 * This class is a container for functions that handle the app JWT logic
 * and uses an redis-like in-memory cache which depends on the `cache_manager` package
 */
@Injectable()
export class TokensService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) { }

    /**
     * General function for handling the JWT access and refresh tokens generation logic
     * issues an access token which would expire in an hour and a refresh token which would
     * expire in a year and caches that refresh token in order for the app to be able to do
     * verifications later
     */
    async generateAuthTokens(user: User): Promise<AuthTokens> {
        const { id, phoneNumber } = user;
        const payload = { id, phoneNumber };
        const accessTokenSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
        const refreshTokenSecret = this.configService.get<string>('REFRESH_TOKEN_SECRET');
        const accessToken = this.jwtService.sign(payload, { secret: accessTokenSecret, issuer: 'Medline', expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(payload, { secret: refreshTokenSecret, issuer: 'Medline', expiresIn: '1y' });
        // Caching the refresh token for one year
        const secondsInOneYear: number = 60 * 60 * 24 * 365;
        const cacheResult = await this.cacheManager.set<string>(id, refreshToken, { ttl: secondsInOneYear });
        if (!cacheResult) throw new InternalServerErrorException('Error generating JWT tokens');
        return { accessToken, refreshToken };
    }

    async refreshAuthTokens(input: RefreshTokensInput): Promise<AuthTokens> {
        const { refreshToken } = input;
        const refreshTokenSecret = this.configService.get<string>('REFRESH_TOKEN_SECRET');
        try {
            const payload = this.jwtService.verify(refreshToken, { secret: refreshTokenSecret });
            if (payload) {
                const userTryingToRefreshTheTokensFor: User = await this.prismaService.user.findUnique({ where: { id: payload.id } });
                if (userTryingToRefreshTheTokensFor) {
                    const oldRefreshToken = await this.cacheManager.get<string>(payload.id);
                    if (refreshToken === oldRefreshToken) {
                        const newAuthTokens = await this.generateAuthTokens(userTryingToRefreshTheTokensFor);
                        return newAuthTokens;
                    }
                }
            }
        } catch (error) {
            this.handleJwtErrors(error);
        }

        throw new BadRequestException('Invalid refresh token!');
    }

    /**
     * Used for logout functionality
     */
    async removeRefreshTokenFromCache(userId: string): Promise<boolean> {
        const result = await this.cacheManager.del(userId);
        if (!result) return false;
        return true;
    }

    /**
     * The most vital function in the application security, it's responsible for identifing
     * the user that triggered the request
     * @param accessToken is the access token issued for the particular user by the server
     * @returns the data of the user who triggered the request
     */
    async getUserFromAccessToken(accessToken: string): Promise<User> {
        const accessTokenSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
        try {
            const payload = this.jwtService.verify(accessToken, { secret: accessTokenSecret });
            if (payload) {
                const user: User = await this.prismaService.user.findUnique({ where: { id: payload.id } });
                if (user) {
                    return user;
                } else {
                    throw new NotFoundException("Can't find the token user!");
                }
            } else {
                throw new BadRequestException('Invalid token!');
            }
        } catch (error) {
            if (error.status === 400 || error.status === 404) {
                throw error
            }
            else {
                this.handleJwtErrors(error);
            }
        }
    }

    private handleJwtErrors(error) {
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            throw new BadRequestException('Invalid token!');
        } else {
            throw new InternalServerErrorException();
        }
    }
}