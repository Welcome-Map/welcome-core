import { AbilityClass, AbilityBuilder, subject } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from './types';
import { PrismaService } from '../prisma.service';
import { PrismaAbility, Subjects } from '@casl/prisma';
import {
  User,
  Organisation,
  PasswordReset,
  AccountVerification,
  OrgsMemberships,
} from '@prisma/client';
import { Role } from '../organisations/entities/orgsmemberships.entity';

type AppAbility = PrismaAbility<
  [
    string,
    Subjects<{
      User: User;
      Organisation: Organisation;
      PasswordReset: PasswordReset;
      AccountVerification: AccountVerification;
      OrgsMemberships: OrgsMemberships;
      all: 'all';
    }>,
  ]
>;

const AppAbility = PrismaAbility as AbilityClass<AppAbility>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private prisma: PrismaService) {}
  async createForOrgs(user: User, organisationId) {
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        orgsMemberships: { where: { organisationId } },
      },
    });
    const { can, cannot, build } = new AbilityBuilder(AppAbility);

    if (user.admin) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      can(Action.Read, 'all'); // read-only access to everything
    }
    if (dbUser.orgsMemberships[0]?.role == Role.ADMIN) {
      can(Action.Update, 'Organisation');
      can(Action.Delete, 'Organisation');
    } else {
      cannot(Action.Update, 'Organisation');
      cannot(Action.Delete, 'Organisation');
    }

    return build();
  }
}
