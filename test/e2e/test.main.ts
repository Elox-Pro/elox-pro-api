import { Test, TestingModule } from "@nestjs/testing";
import { TestModule } from "./test.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import * as cookieParser from 'cookie-parser';

export async function bootstrapTest(localModules = []) {

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [TestModule, ...localModules]
    }).compile();

    const app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));

    app.enableCors({
        origin: "*",
    });
    app.use(cookieParser());
    app.useLogger(new Logger());

    await app.init();

    return app;
}



