import { Role } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { OrgsMemberships } from '../entities/orgsmemberships.entity';

@Injectable()
export class OrgsMembershipsRepository {
  constructor(private prisma: PrismaService) {}
  async create(payload: { id: string; userId: string; role: Role }) {
    const orgMembership = await this.prisma.orgsMemberships.create({
      data: {
        userId: payload.userId,
        organisationId: payload.id,
        role: payload.role,
      },
    });
    return new OrgsMemberships(orgMembership);
  }
}
