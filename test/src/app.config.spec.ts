import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfig } from 'app.config';
import { AppModule } from 'app.module';

describe('AppConfig', () => {

    let config: AppConfig;

    beforeEach(async () => {

        const app: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ envFilePath: '.env.test' })],
            providers: [AppConfig]
        }).compile();

        config = app.get<AppConfig>(AppConfig);
    });

    it('should defined the port variable', () => {
        expect(config.ENVIRONMENT).toBeDefined();
        expect(config.ENVIRONMENT).toBe('testing');
    });

});