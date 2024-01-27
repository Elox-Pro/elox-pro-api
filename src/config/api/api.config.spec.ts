import { Test, TestingModule } from '@nestjs/testing';
import { ApiConfig } from "./api.config";
import { AppConfigModule } from '../app.config.module';

describe('ApiConfig', () => {

    let apiConfig: ApiConfig;

    beforeEach(async () => {

        const app: TestingModule = await Test.createTestingModule({
            imports: [AppConfigModule]
        }).compile();

        apiConfig = app.get<ApiConfig>(ApiConfig);
    });

    describe('Environment variables', () => {
        it('should defined the port variable', () => {
            expect(apiConfig.PORT).toBeDefined();
        });
    });
});