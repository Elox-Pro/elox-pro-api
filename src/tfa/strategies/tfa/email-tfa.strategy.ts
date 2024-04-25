import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { TfaStrategy } from "./tfa.strategy";
import { HashingStrategy } from "@app/common/strategies/hashing/hashing.strategy";
import { RedisService } from "redis/redis.service";
import { EmailFactory } from "@app/email/factories/email.factory";
import { EmailType } from "@app/email/enums/email-type.enum";
import { EmailAddressDto } from "@app/email/dtos/email-address.dto";
import { EMAIL_TFA_STRATEGY_KEY, UPDATE_EMAIL_ACTION_KEY } from "../../constants/tfa.constants";
import { TfaRequestDto } from "../../dtos/tfa/tfa.request.dto";
import { TfaAction } from "../../enums/tfa-action.enum";
import { TFADto } from "@app/tfa/dtos/tfa/tfa.dto";
import { TfaResponseDto } from "@app/tfa/dtos/tfa/tfa.response.dto";
import { getUserLang } from "@app/common/helpers/get-user-lang.helper";

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

    async execute({ user, ipClient, action, lang }: TfaRequestDto): Promise<boolean> {

        const { email, username, emailVerified } = user;

        // Update user language(optional, based on logic in getUserLang)
        const userLang = getUserLang(user.lang, lang);

        if (!username) {
            this.logger.error(`Username not found: ${username}`);
            throw new UnauthorizedException('error.username-not-found');
        }

        if (!email) {
            this.logger.error(`Email not found: ${email}`);
            throw new UnauthorizedException('error.email-not-found');
        }

        if (action !== TfaAction.SIGN_UP && !emailVerified) {
            this.logger.error(`Email not verified: ${email}`);
            throw new UnauthorizedException('error.email-not-verified');
        }

        if (!ipClient) {
            this.logger.error(`Ip request not found: ${ipClient}`);
            throw new UnauthorizedException('error.ip-request-not-found');
        }

        try {
            const code = this.generateCode(this.CODE_LENGTH);
            const hash = await this.hashingStrategy.hash(code.toString());
            const key = this.generateKey(username);

            const savedCode = await this.redis.getClient().get(key);

            if (savedCode) {
                this.logger.log(`Code already exists`);
                return true;
            }

            let ttl = this.DEFAUT_TTL;
            const metadata: Record<string, string> = {};
            switch (action) {
                case TfaAction.SIGN_UP:
                    ttl = this.SIGNUP_TTL;
                    break;
                case TfaAction.UPDATE_EMAIL:
                    metadata[UPDATE_EMAIL_ACTION_KEY.NEW_EMAIL] = email;
                    break;
                default: break;

            }

            await this.redis
                .getClient()
                .set(key, JSON.stringify(new TFADto(hash, action, metadata)), {
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

            this.logger.log(`TFA Email sent to ${email}`);

            return true;
        } catch (error) {
            await this.redis.getClient().del(this.generateKey(username));
            this.logger.error(error);
            throw error;
        }
    }

    async verify(username: string, code: string): Promise<TfaResponseDto> {
        const key = this.generateKey(username);
        const serializedTFA = await this.redis.getClient().get(key);

        if (!serializedTFA) {
            this.logger.error(`Code not found: ${username}`);
            throw new UnauthorizedException('error.invalid-credentials');
        }

        const tfa = JSON.parse(serializedTFA);
        const { hash, action, metadata } = tfa;

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

        return new TfaResponseDto(result, action, metadata);
    }

    private generateCode(digits: number): number {
        const value = Math.pow(10, digits - 1);
        return Math.floor(Math.random() * (9 * value) + value);
    }

    private generateKey(username: string): string {
        return `${EMAIL_TFA_STRATEGY_KEY}:${username}`
    }
}