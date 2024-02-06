import { Test, TestingModule } from "@nestjs/testing";
import { TestModule } from "./test.module";
import { ValidationPipe } from "@nestjs/common";

export async function bootstrapTest() {

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [TestModule]
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

    await app.init();
    return app;
}



