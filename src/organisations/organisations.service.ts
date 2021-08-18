import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { createOrganisationDTO } from './dto/createOrganisation.dto';
import { Organisation, Prisma } from '.prisma/client';
import { User } from '../users/entities/user.entity';
import { Role } from './entities/orgsmemberships.entity';

@Injectable()
export class OrganisationsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async findAll(take = 10, skip = 0) {
    return this.prisma.organisation.findMany({ take, skip });
  }

  async create(
    data: Prisma.OrganisationCreateInput,
    user: User,
  ): Promise<Partial<Organisation>> {
    const org = await this.prisma.organisation.create({
      data,
    });

    await this.prisma.orgsMemberships.create({
      data: {
        organisationId: org.id,
        userId: user.id,
        role: Role.ADMIN,
      },
    });

    return org;
  }
}
