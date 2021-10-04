import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
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
}
