import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from 'src/app.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { MeModule } from './modules/me/me.module';
import { InternalModule } from './modules/internal/internal.module';
import { StaticModule } from './modules/static/static.module';
import { ExternalModule } from './modules/external/external.module';

@Module({
  imports: [AuthModule, MeModule, InternalModule, StaticModule, ExternalModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
