import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { TfaStrategy } from "./tfa.strategy";
import { HashingStrategy } from "authentication/strategies/hashing/hashing.strategy";
import { RedisService } from "redis/redis.service";
import { EmailFactory } from "common/email/factories/email.factory";
import { EmailType } from "common/email/enums/email-type.enum";
import { EmailAddressDto } from "common/email/dtos/email-address.dto";
import { EMAIL_TFA_STRATEGY_KEY } from "authentication/constants/authentication.constants";

@Injectable()
export class EmailTfaStrategy extends TfaStrategy {

    private readonly logger = new Logger(EmailTfaStrategy.name);
    private readonly CODE_LENGTH = 6;
    private readonly TTL = 60 * 10; // Expire time in seconds

    constructor(
        private readonly hashingStrategy: HashingStrategy,
        private readonly redis: RedisService,
        private readonly emailFactory: EmailFactory
    ) {

        super();
    }

    async execute({ user, ipClient }): Promise<boolean> {

        const { email, username, emailVerified } = user;

        if (!username) {
            this.logger.error(`Username not found: ${username}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!email) {
            this.logger.error(`Email not found: ${email}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!emailVerified) {
            this.logger.error(`Email not verified: ${email}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!ipClient) {
            this.logger.error(`IpClient not found: ${ipClient}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        const code = this.generateCode(this.CODE_LENGTH);
        const hash = await this.hashingStrategy.hash(code.toString());
        const key = this.generateKey(username);

        const savedCode = await this.redis.getClient().get(key);

        if (savedCode) {
            return true;
        }

        await this.redis.getClient().set(key, hash, {
            EX: this.TTL
        });

        const emailTemplate = this.emailFactory.getEmail(EmailType.TFA);

        await emailTemplate.send(new EmailAddressDto(email, username), new Map<string, string>([
            ['code', code],
            ['username', username],
            ['ipClient', ipClient]])
        );

        return true;
    }

    async verify(username: string, code: string): Promise<boolean> {
        const key = this.generateKey(username);
        const hash = await this.redis.getClient().get(key);

        if (!username) {
            this.logger.error(`Username not found: ${username}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!code) {
            this.logger.error(`Code not found: ${code}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!hash) {
            this.logger.error(`Hash not found: ${hash}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        const result = await this.hashingStrategy.compare(code, hash);

        if (result) {
            await this.redis.getClient().del(key);
        }

        return result;
    }

    private generateCode(digits: number): number {
        const value = Math.pow(10, digits - 1);
        return Math.floor(Math.random() * (9 * value) + value);
    }

    private generateKey(username: string): string {
        return `${EMAIL_TFA_STRATEGY_KEY}:${username}`
    }
}