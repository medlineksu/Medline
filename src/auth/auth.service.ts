import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthTokens } from "./entity/auth_tokens.entity";
import { RegisterInput } from "./input/register.input";
import { ConfigService } from "@nestjs/config";
import * as twilio from 'twilio';
import { SendSmsInput } from "./input/send_sms.input";
import { SendSmsResult, SendSmsResultOperationType, SendSmsResultStatus } from "./entity/send_sms_result.entity";
import { LoginInput } from "./input/login.input";
import { TokensService } from "src/tokens/tokens.service";
import { RefreshTokensInput } from "./input/refresh_tokens.input";
import { FakeLoginInput } from "./input/fake_login.input";
import { LogoutResult, LogoutResultStatus } from "./entity/logout_result.entity";

@Injectable()
export class AuthService {
    twillioClient: twilio.Twilio;
    serviceId: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
        private readonly tokensService: TokensService,
    ) {
        this.twillioClient = twilio(
            configService.get<string>('TWILIO_ACCOUNT_SID'),
            configService.get<string>('TWILIO_AUTH_TOKEN'),
        );
        this.serviceId = configService.get<string>('TWILIO_SERVICE_ID');
    }

    // Login Psuedo:
    // 1. We check if the user trying to login is a real user stored in the database
    // 2. If exists ? try to verify him with the given confirmation code
    //              : send a "NotFound" exception
    // 3. If confirmation code is correct ? generate tokens and send them with the user info
    //                                    : send a "BadRequest" exception

    async login(input: LoginInput) {
        const user: User = await this.prismaService.user.findUnique({ where: { phoneNumber: input.phoneNumber } });
        if (user) {
            const result = await this.twillioClient.verify.services(this.serviceId).verificationChecks.create({ to: user.phoneNumber, code: input.confirmationCode });
            if (result.status === 'approved') {
                const authTokens = await this.tokensService.generateAuthTokens(user);
                return authTokens;
            }
        }
        throw new NotFoundException("Invalid Credentials!");
    }

    // Logout Pseudo:
    // 1. Just remove the refresh token from the cache

    async logout(input): Promise<LogoutResult> {
        const { user } = input;
        const success: boolean = await this.tokensService.removeRefreshTokenFromCache(user.id);
        const logoutResult: LogoutResult = new LogoutResult();
        logoutResult.status = success ? LogoutResultStatus.success : LogoutResultStatus.fail;
        return logoutResult;
    }

    // Register Psuedo:
    // 1. We check if the given phone number is already in user by another user
    // 2. Found a user with the same phone number ? Send a "Conflict" exception
    //                                            : We try to verify the given phone number with the given confirmation code
    // 3. verified ? try creating a new user record in the database
    //             : respond with an error message
    // 4. the record was added ? then registering was success full and we should generate and return auth tokens
    //                         : mostly means that the phone number is already in use and we should respond with an error message

    async register(input: RegisterInput): Promise<AuthTokens> {
        const { name, phoneNumber, confirmationCode } = input;
        const userWithMatchingInfo: User = await this.prismaService.user.findUnique({ where: { phoneNumber } });
        if (userWithMatchingInfo) throw new ConflictException('This phone number is already in use!');
        const result = await this.twillioClient.verify.services(this.serviceId).verificationChecks.create({ to: phoneNumber, code: confirmationCode });
        if (result.status === 'approved') {
            const newUser: User = await this.prismaService.user.create({ data: { name, phoneNumber } });
            const authTokens: AuthTokens = await this.tokensService.generateAuthTokens(newUser);
            return authTokens;
        } else {
            throw new BadRequestException('Invalid confirmation code!');
        }
    }

    // Sending SMS Pseudo:
    // 1. We should query the database for any user registered with the given phone number
    // 2. If found ? means this is a login operation
    //             : this is a register operation
    // 3. We should just try and send the SMS directly because if the user exists then it means he's trying to login and if not then he's trying to register
    // 4. Include the operation type in the response

    async sendSms(input: SendSmsInput): Promise<SendSmsResult> {
        const phoneNumber = input.phoneNumber;
        const user: User = await this.prismaService.user.findUnique({ where: { phoneNumber } });
        const result = await this.twillioClient.verify.services(this.serviceId).verifications.create({ channel: 'sms', to: phoneNumber });
        return {
            "operation": user ? SendSmsResultOperationType.login : SendSmsResultOperationType.register,
            "status": result.status === "pending" ? SendSmsResultStatus.success : SendSmsResultStatus.fail,
        }
    }

    /**
     * Just calls another function in the `TokensService` class
     * @param input requires the refresh token of the old authentication pair
     * @returns a new pair of authentication tokens if the old refresh token was verified successfully
     */
    async refreshAuthTokens(input: RefreshTokensInput): Promise<AuthTokens> {
        return await this.tokensService.refreshAuthTokens(input);
    }

    // TODO remove this in production
    async fakeLogin(input: FakeLoginInput): Promise<AuthTokens> {
        const { id, phoneNumber } = input;
        const fakeUser: User = { id, phoneNumber, name: "Fake", createdAt: new Date(), updatedAt: new Date() };
        return await this.tokensService.generateAuthTokens(fakeUser);
    }
}