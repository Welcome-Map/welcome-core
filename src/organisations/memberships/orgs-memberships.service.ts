import { Role } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { CaslOrgsAbilityFactory } from '../../casl/casl-orgs-ability.factory';
import { OrgsMembershipsRepository } from './orgs-memberships.repository';

@Injectable()
export class OrgsMembershipsService {
  constructor(
    private orgsMemberships: OrgsMembershipsRepository,
    private caslAbilityFactory: CaslOrgsAbilityFactory,
  ) {}
  create(payload: { id: string; userId: string; role: Role }) {
    return this.orgsMemberships.create(payload);
  }
}
