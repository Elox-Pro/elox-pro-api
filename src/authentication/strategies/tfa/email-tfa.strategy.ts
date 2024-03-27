import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { TfaStrategy } from "./tfa.strategy";
import { HashingStrategy } from "authentication/strategies/hashing/hashing.strategy";
import { RedisService } from "redis/redis.service";
import { EmailFactory } from "common/email/factories/email.factory";
import { EmailType } from "common/email/enums/email-type.enum";
import { EmailAddressDto } from "common/email/dtos/email-address.dto";
import { EMAIL_TFA_STRATEGY_KEY } from "authentication/constants/authentication.constants";
import { TFARequestDto } from "@app/authentication/dtos/tfa/tfa.request.dto";
import { TfaAction } from "@app/authentication/enums/tfa-action.enum";
import { TFADto } from "@app/authentication/dtos/tfa/tfa.dto";
import { TFAResponseDto } from "@app/authentication/dtos/tfa/tfa.response.dto";
import getUserLang from "@app/common/helpers/get-user-lang.helper";

@Injectable()
export class EmailTfaStrategy extends TfaStrategy {

    private readonly logger = new Logger(EmailTfaStrategy.name);
    private readonly CODE_LENGTH = 6;
    private readonly DEFAUT_TTL = 60 * 10; // Expire time in seconds (10 minutes)
    private readonly SIGNUP_TTL = 60 * 60 * 24 * 2; // Expire time in seconds (2 days)

    constructor(
        private readonly hashingStrategy: HashingStrategy,
        private readonly redis: RedisService,
        private readonly emailFactory: EmailFactory
    ) {
        super();
    }

    async execute({ user, ipClient, action, lang }: TFARequestDto): Promise<boolean> {

        const { email, username, emailVerified } = user;
        // Update user language(optional, based on logic in getUserLang)
        const userLang = getUserLang(user.lang, lang);

        if (!username) {
            this.logger.error(`Username not found: ${username}`);
            throw new UnauthorizedException('error.invalid-credentials');
        }

        if (!email) {
            this.logger.error(`Email not found: ${email}`);
            throw new UnauthorizedException('error.invalid-credentials');
        }

        if (action !== TfaAction.SIGN_UP && !emailVerified) {
            this.logger.error(`Email not verified: ${email}`);
            throw new UnauthorizedException('error.email-not-verified');
        }

        if (!ipClient) {
            this.logger.error(`IpClient not found: ${ipClient}`);
            throw new UnauthorizedException('error.invalid-credentials');
        }

        const code = this.generateCode(this.CODE_LENGTH);
        const hash = await this.hashingStrategy.hash(code.toString());
        const key = this.generateKey(username);

        const savedCode = await this.redis.getClient().get(key);

        if (savedCode) {
            return true;
        }

        const ttl = action !== TfaAction.SIGN_UP ? this.DEFAUT_TTL : this.SIGNUP_TTL;

        await this.redis.getClient().set(key, JSON.stringify(new TFADto(hash, action)), {
            EX: ttl
        });

        const emailTemplate = this.emailFactory.getEmail(EmailType.TFA);

        await emailTemplate.send(new EmailAddressDto(email, username), new Map<string, string>([
            ['lang', userLang],
            ['code', code.toString()],
            ['username', username],
            ['ipClient', ipClient],
            ['ttl', ttl.toString()]
        ]));

        return true;
    }

    async verify(username: string, code: string): Promise<TFAResponseDto> {
        const key = this.generateKey(username);
        const serializedTFA = await this.redis.getClient().get(key);

        if (!serializedTFA) {
            this.logger.error(`Code not found: ${username}`);
            throw new UnauthorizedException('error.invalid-credentials');
        }

        const tfa = JSON.parse(serializedTFA);
        const { hash, action } = tfa;

        if (!username) {
            this.logger.error(`Username not found: ${username}`);
            throw new UnauthorizedException('error.invalid-credentials');
        }

        if (!code) {
            this.logger.error(`Code not found: ${code}`);
            throw new UnauthorizedException('error.invalid-credentials');
        }

        if (!hash) {
            this.logger.error(`Hash not found: ${hash}`);
            throw new UnauthorizedException('error.invalid-credentials');
        }

        const result = await this.hashingStrategy.compare(code, hash);

        if (result) {
            await this.redis.getClient().del(key);
        }

        return new TFAResponseDto(result, action);
    }

    private generateCode(digits: number): number {
        const value = Math.pow(10, digits - 1);
        return Math.floor(Math.random() * (9 * value) + value);
    }

    private generateKey(username: string): string {
        return `${EMAIL_TFA_STRATEGY_KEY}:${username}`
    }
}