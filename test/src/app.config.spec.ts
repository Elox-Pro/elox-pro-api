import { Test, TestingModule } from '@nestjs/testing';
import { AppConfig } from '../../src/app.config';
import { AppModule } from '../../src/app.module';

describe('AppConfig', () => {

    let config: AppConfig;

    beforeEach(async () => {

        const app: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        config = app.get<AppConfig>(AppConfig);
    });


    it('should defined the port variable', () => {
        expect(config.PORT).toBeDefined();
    });

});