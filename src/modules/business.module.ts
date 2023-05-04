import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MeModule } from './me/me.module';
import { InternalModule } from './internal/internal.module';
import { StaticModule } from './static/static.module';
import { ExternalModule } from './external/external.module';
import { ExampleModule } from './example/user.module';
import { InhouseModule } from './inhouse/inhouse.module';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [AuthModule, MeModule, InternalModule, StaticModule, ExternalModule, ExampleModule, InhouseModule, StockModule],
})
export class BusinessModule { }
