import { Role } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { CaslOrgsAbilityFactory } from '../../casl/casl-orgs-ability.factory';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class OrgsMembershipsService {
  constructor(
    private prisma: PrismaService,
    private caslAbilityFactory: CaslOrgsAbilityFactory,
  ) {}
  create(payload: { id: string; userId: string; role: Role }) {
    this.prisma.orgsMemberships.create({
      data: {
        userId: payload.userId,
        organisationId: payload.id,
        role: payload.role,
      },
    });
  }
}
