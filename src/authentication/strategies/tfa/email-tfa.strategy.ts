import { Injectable } from "@nestjs/common";
import { TfaStrategy } from "./tfa.strategy";
import { HashingStrategy } from "src/authentication/strategies/hashing/hashing.strategy";
import { RedisService } from "src/redis/redis.service";
import { RedisClientType } from "redis";
import { EmailFactory } from "src/common/email/factories/email.factory";
import { EmailType } from "src/common/email/enums/email-type.enum";
import { EmailAddressDTO } from "src/common/email/dtos/email-address.dto";
import { User } from "@prisma/client";

@Injectable()
export class EmailTfaStrategy extends TfaStrategy {

    private redis: RedisClientType;
    private readonly TTL = 60 * 10; // Expire time in seconds

    constructor(
        private readonly hashingStrategy: HashingStrategy,
        private readonly redisService: RedisService,
        private readonly emailFactory: EmailFactory,
    ) {

        super();
        this.redis = this.redisService.getClient();
    }

    async generate(user: User): Promise<boolean> {

        const { email, username, emailVerified } = user;

        if (!username) {
            throw new Error('Username is required');
        }

        if (!email) {
            throw new Error('Email is required');
        }

        if (!emailVerified) {
            throw new Error('Email not verified');
        }

        const hash = await this.generateCode(6);

        await this.redis.set(this.generateKey(username), hash, {
            EX: this.TTL
        });

        const emailTemplate = this.emailFactory.getEmail(EmailType.TFA);

        await emailTemplate.send(
            new EmailAddressDTO(email, username),
            new Map<string, string>([[
                'code', hash
            ]])
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

    private async generateCode(digits: number): Promise<string> {
        const value = Math.pow(10, digits - 1);
        const code = Math.floor(Math.random() * (9 * value) + value);
        return await this.hashingStrategy.hash(code.toString());
    }

    private generateKey(id: string): string {
        return `email-tfa:${id}`
    }
}