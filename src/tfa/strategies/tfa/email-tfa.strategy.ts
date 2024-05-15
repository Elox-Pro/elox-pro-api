import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { TfaStrategy } from "./tfa.strategy";
import { HashingStrategy } from "@app/common/strategies/hashing/hashing.strategy";
import { RedisService } from "redis/redis.service";
import { EmailFactory } from "@app/email/factories/email.factory";
import { EmailType } from "@app/email/enums/email-type.enum";
import { EmailAddressDto } from "@app/email/dtos/email-address.dto";
import { EMAIL_TFA_STRATEGY_KEY } from "../../constants/tfa.constants";
import { TfaRequestDto } from "../../dtos/tfa/tfa.request.dto";
import { TfaAction } from "../../enums/tfa-action.enum";
import { TFADto } from "@app/tfa/dtos/tfa/tfa.dto";
import { TfaResponseDto } from "@app/tfa/dtos/tfa/tfa.response.dto";
import { CommonConfig } from "@app/common/config/common.config";
import { Enviroment } from "@app/common/enums/enviroment.enum";

@Injectable()
export class EmailTfaStrategy extends TfaStrategy {

    private readonly logger = new Logger(EmailTfaStrategy.name);
    private readonly CODE_LENGTH = 6;
    private readonly DEFAUT_TTL = 60 * 10; // Expire time in seconds (10 minutes)
    private readonly SIGNUP_TTL = 60 * 60 * 24 * 2; // Expire time in seconds (2 days)

    constructor(
        private readonly hashingStrategy: HashingStrategy,
        private readonly redis: RedisService,
        private readonly emailFactory: EmailFactory,
        private readonly config: CommonConfig
    ) {
        super();
    }

    async execute({ user, ipClient, action, lang, metadata }: TfaRequestDto): Promise<boolean> {

        const { email, username, emailVerified } = user;

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

            const ttl = this.getTTL(action);

            await this.redis
                .getClient()
                .set(key, JSON.stringify(new TFADto(hash, action, metadata)), {
                    EX: ttl
                });

            const emailTemplate = this.emailFactory.getEmail(EmailType.TFA);

            await emailTemplate.send(new EmailAddressDto(email, username), new Map<string, string>([
                ['lang', lang],
                ['code', code.toString()],
                ['username', username],
                ['ipClient', ipClient],
                ['ttl', ttl.toString()]
            ]));

            this.logger.log(`TFA Email sent to ${email}`);

            return true;
        } catch (error) {
            this.logger.error(error);
            await this.redis.getClient().del(this.generateKey(username));
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

        if (this.config.ENVIRONMENT === Enviroment.TEST) {
            return 123456;
        }

        const value = Math.pow(10, digits - 1);
        return Math.floor(Math.random() * (9 * value) + value);
    }

    private generateKey(username: string): string {
        return `${EMAIL_TFA_STRATEGY_KEY}:${username}`
    }

    private getTTL(action: TfaAction): number {
        return action === TfaAction.SIGN_UP ? this.SIGNUP_TTL : this.DEFAUT_TTL
    }
}