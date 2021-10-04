import { Role } from '.prisma/client';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';

export class OrgsMemberships extends BaseEntity {
  constructor(partial: Partial<OrgsMemberships>) {
    super();
    Object.assign(this, partial);
  }
  id: string;

  role: Role;

  userId: string;

  organisationId: string;

  user?: User;
}
