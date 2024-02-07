import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { AppConfig } from './app.config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthorizationModule } from './authorization/authorization.module';

@Module({
  imports: [
    PrismaModule,
    AuthenticationModule,
    AuthorizationModule,
    UserModule,
  ],
  providers: [AppConfig]
})
export class AppModule { }
