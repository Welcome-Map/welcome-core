import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';
import { OrgsMemberships } from './orgsmemberships.entity';

export class Organisation extends BaseEntity {
  constructor(partial: Partial<Organisation>) {
    super();
    Object.assign(this, partial);
  }

  name: string;

  description?: string;

  logo?: string;

  website?: string;

  users?: User[];
  orgsMemberships?: OrgsMemberships[];
}
