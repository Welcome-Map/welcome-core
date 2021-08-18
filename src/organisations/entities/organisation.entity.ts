import { BaseEntity } from '../../common/base.entity';

export class Organisation extends BaseEntity {
  constructor(partial: Partial<Organisation>) {
    super();
    Object.assign(this, partial);
  }

  name: string;

  description?: string;

  logo?: string;

  website?: string;
}
