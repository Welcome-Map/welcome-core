import { BaseEntity } from '../../common/base.entity';

export enum Role {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

export class OrrgsMemberships extends BaseEntity {
  constructor(partial: Partial<OrrgsMemberships>) {
    super();
    Object.assign(this, partial);
  }
  id: string;

  role: Role;

  userId: string;

  organisationId: string;
}
