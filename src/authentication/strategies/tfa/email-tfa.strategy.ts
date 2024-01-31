import { BadRequestException, Injectable } from "@nestjs/common";
import { TfaStrategy } from "./tfa.strategy";
import { HashingStrategy } from "src/authentication/strategies/hashing/hashing.strategy";
import { RedisService } from "src/redis/redis.service";
import { RedisClientType } from "redis";
import { EmailFactory } from "src/common/email/factories/email.factory";
import { EmailType } from "src/common/email/enums/email-type.enum";
import { EmailAddressDto } from "src/common/email/dtos/email-address.dto";

@Injectable()
export class EmailTfaStrategy extends TfaStrategy {

    private redis: RedisClientType;
    private readonly CODE_LENGTH = 6;
    private readonly TTL = 60 * 10; // Expire time in seconds

    constructor(
        private readonly hashingStrategy: HashingStrategy,
        private readonly redisService: RedisService,
        private readonly emailFactory: EmailFactory,
    ) {

        super();
        this.redis = this.redisService.getClient();
    }

    async generate({ user, ipClient }): Promise<boolean> {

        const { email, username, emailVerified } = user;

        this.validate(username, email, emailVerified, ipClient);

        const code = this.generateCode(this.CODE_LENGTH);
        const hash = await this.hashingStrategy.hash(code.toString());

        await this.redis.set(this.generateKey(username), hash, {
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

    async verify(id: string, code: string): Promise<boolean> {
        const key = this.generateKey(id);
        const hash = await this.redis.get(key);

        if (!code) {
            return false;
        }

        await this.redis.del(key);

        return this.hashingStrategy.compare(code, hash);
    }

    private validate(
        username: string, email: string, emailVerified: boolean, ipClient: string): void {

        if (!username) {
            throw new BadRequestException('Username is required');
        }

        if (!email) {
            throw new BadRequestException('Email is required');
        }

        if (!emailVerified) {
            throw new BadRequestException('Email not verified');
        }

        if (!ipClient) {
            throw new BadRequestException('IP is required');
        }
    }

    private generateCode(digits: number): number {
        const value = Math.pow(10, digits - 1);
        return Math.floor(Math.random() * (9 * value) + value);
    }

    private generateKey(id: string): string {
        return `elox-pro:email-tfa:${id}`
    }
}