import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AuthTokens } from "./entity/auth_tokens.entity";
import { LoginInput } from "./input/login.input";
import { RefreshTokensInput } from "./input/refresh_tokens.input";
import { RegisterInput } from "./input/register.input";
import { SendSmsInput } from "./input/send_sms.input";
import { SendSmsResult } from "./entity/send_sms_result.entity";
import { FakeLoginInput } from "./input/fake_login.input";
import { LogoutResult } from "./entity/logout_result.entity";
import { LogoutInput } from "./input/logout.input";

@Resolver(of => AuthTokens)
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    /**
     * This will send a SMS containing a verifiction code the user phone number
     * @param input requires the user phone number that the sms will be sent to
     * @returns information about the operation status and whether the user should be registering
     * or logining
     */
    @Mutation(returns => SendSmsResult)
    async sendSms(@Args('input') input: SendSmsInput): Promise<SendSmsResult> {
        return await this.authService.sendSms(input);
    }

    /**
     * Creates a new record for the user in the database and issues a pair of authentication tokes
     * to the user
     * @param input requires the basic user information like the name and the phone number
     * also the verification code for the phone number
     * @returns a new pair of authentication tokens
     */
    @Mutation(returns => AuthTokens)
    async register(@Args('input') input: RegisterInput): Promise<AuthTokens> {
        return await this.authService.register(input);
    }

    /**
     * Just checks for the usre in the database and verifies the confirmation code if the user was found
     * @param input requires the user phone number and verification code
     * @returns a new pair of authentication tokens if everything was valid
     */
    @Mutation(returns => AuthTokens)
    async login(@Args('input') input: LoginInput): Promise<AuthTokens> {
        return await this.authService.login(input);
    }

    @Mutation(returns => LogoutResult)
    async logout(@Args('input') input: LogoutInput): Promise<LogoutResult> {
        return await this.authService.logout(input);
    }

    /**
     * @param input will include the old refresh token that will be swaped for a new pair
     * @returns new pair of authentication tokens
     */
    @Mutation(returns => AuthTokens)
    async refreshTokens(@Args('input') input: RefreshTokensInput) {
        return await this.authService.refreshAuthTokens(input);
    }

    // TODO remove this production
    /**
     * ! THIS IS FOR TESTING PURPOSES ONLY
     * @param input just takes a fake user UUID and phone number
     * @returns authentication tokens with the user id and phone number stored in them as a payload
     */
    @Mutation(returns => AuthTokens)
    async fakeLogin(@Args('input') input: FakeLoginInput): Promise<AuthTokens> {
        return await this.authService.fakeLogin(input);
    }
 }