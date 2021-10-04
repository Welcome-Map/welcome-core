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
import { OrgsMembershipsController } from './memberships/orgs-memberships.controller';
import { OrgsMembershipsService } from './memberships/orgs-memberships.service';
import { OrganisationsRepository } from './organisations.repository';
import { OrgsMembershipsRepository } from './memberships/orgs-memberships.repository';

@Module({
  imports: [UsersModule, CaslModule],
  providers: [
    OrganisationsService,
    OrgsMembershipsService,
    PrismaService,
    OrganisationsRepository,
    OrgsMembershipsRepository,
  ],
  controllers: [OrganisationsController, OrgsMembershipsController],
})
export class OrganisationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PagerMiddleware)
      .forRoutes({ path: 'organisations', method: RequestMethod.GET });
  }
}
