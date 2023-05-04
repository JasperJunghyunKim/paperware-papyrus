import { DynamicModule, Module } from '@nestjs/common';
import { BusinessModule } from './modules/business.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './core/config/confnig.validator';
import { DatabaseModule, HealthModule, RouteScanModule } from './core';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters';
import { HttpLoggingInterceptor } from './interceptors';

const configModule = (): DynamicModule => {
  return ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.env`,
    validate,
  });
};

@Module({
  imports: [
    configModule(),
    HealthModule,
    RouteScanModule,
    BusinessModule,
    DatabaseModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
  ],
})
export class AppModule {}
