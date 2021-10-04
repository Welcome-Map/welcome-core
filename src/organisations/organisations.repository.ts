import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateOrganisationDTO } from './dto/updateOrganisation.dto';
import { Organisation } from './entities/organisation.entity';

@Injectable()
export class OrganisationsRepository {
  constructor(private prisma: PrismaService) {}

  async findMany({
    take,
    skip,
  }: {
    take: number;
    skip: number;
  }): Promise<Organisation[]> {
    const organisations = await this.prisma.organisation.findMany({
      take,
      skip,
    });
    return organisations.map((organisation) => new Organisation(organisation));
  }

  async create(data: Prisma.OrganisationCreateInput): Promise<Organisation> {
    const org = await this.prisma.organisation.create({
      data,
    });
    return new Organisation(org);
  }

  async update(
    id: string,
    updateOrganisationsDTO: UpdateOrganisationDTO,
  ): Promise<Organisation> {
    const organisation = await this.prisma.organisation.update({
      where: { id },
      data: updateOrganisationsDTO,
    });
    return new Organisation(organisation);
  }

  async findUnique(
    where: Prisma.OrganisationWhereUniqueInput,
  ): Promise<Organisation> {
    const organisation = await this.prisma.organisation.findUnique({
      where,
      include: {
        orgsMemberships: {
          include: {
            user: true,
          },
        },
      },
    });
    return new Organisation(organisation);
  }
}
