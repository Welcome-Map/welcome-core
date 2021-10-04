import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Role } from '.prisma/client';
import { User } from '@prisma/client';
import { CaslOrgsAbilityFactory } from '../casl/casl-orgs-ability.factory';
import { UpdateOrganisationDTO } from './dto/updateOrganisation.dto';
import { Action } from '../casl/types';
import { Organisation } from './entities/organisation.entity';
import { OrganisationsRepository } from './organisations.repository';
import { OrgsMembershipsRepository } from './memberships/orgs-memberships.repository';

@Injectable()
export class OrganisationsService {
  constructor(
    private caslAbilityFactory: CaslOrgsAbilityFactory,
    private organisationsRepository: OrganisationsRepository,
    private orgsMembershipsRepository: OrgsMembershipsRepository,
  ) {}

  async findAll(take = 50, skip = 0) {
    return this.organisationsRepository.findMany({
      take,
      skip,
    });
  }

  async create(
    data: Prisma.OrganisationCreateInput,
    user: User,
  ): Promise<Partial<Organisation>> {
    const org = await this.organisationsRepository.create(data);

    await this.orgsMembershipsRepository.create({
      id: org.id,
      userId: user.id,
      role: Role.ADMIN,
    });

    return org;
  }

  async update(
    id: string,
    user: User,
    updateOrganisationsDTO: UpdateOrganisationDTO,
  ): Promise<Organisation> {
    const ability = await this.caslAbilityFactory.createForOrgs(user, id);
    if (ability.can(Action.Update, 'Organisation')) {
      return this.organisationsRepository.update(id, updateOrganisationsDTO);
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async findOne(
    where: Prisma.OrganisationWhereUniqueInput,
  ): Promise<Organisation> {
    return this.organisationsRepository.findUnique(where);
  }
}
