import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '.prisma/client';
import { User } from '@prisma/client';
import { Role } from './entities/orgsmemberships.entity';
import { CaslOrgsAbilityFactory } from '../casl/casl-orgs-ability.factory';
import { UpdateOrganisationDTO } from './dto/updateOrganisation.dto';
import { Action } from '../casl/types';
import { Organisation } from './entities/organisation.entity';
import { OrganisationsRepository } from './organisations.repository';

@Injectable()
export class OrganisationsService {
  constructor(
    private caslAbilityFactory: CaslOrgsAbilityFactory,
    private organisationsRepository: OrganisationsRepository,
  ) {}

  async findAll(take = 10, skip = 0) {
    return this.organisationsRepository.findMany({
      take,
      skip,
    });
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

  async update(
    id: string,
    user: User,
    updateOrganisationsDTO: UpdateOrganisationDTO,
  ) {
    const ability = await this.caslAbilityFactory.createForOrgs(user, id);
    if (ability.can(Action.Update, 'Organisation')) {
      return this.prisma.organisation.update({
        where: { id },
        data: updateOrganisationsDTO,
      });
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async findOne(where: Prisma.OrganisationWhereUniqueInput) {
    return this.prisma.organisation.findUnique({
      where,
      include: {
        orgsMemberships: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
