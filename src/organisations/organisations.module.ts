import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { OrganisationsController } from './organisations.controller';
import { PrismaService } from '../prisma.service';
import { UsersModule } from '../users/users.module';
import { PagerMiddleware } from '../middlewares/pager.middleware';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [UsersModule, CaslModule],
  providers: [OrganisationsService, PrismaService],
  controllers: [OrganisationsController],
})
export class OrganisationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PagerMiddleware)
      .forRoutes({ path: 'organisations', method: RequestMethod.GET });
  }
}
