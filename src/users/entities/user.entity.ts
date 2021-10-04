import { BaseEntity } from '../../common/base.entity';
import { Exclude } from 'class-transformer';

export class User extends BaseEntity {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  username: string;

  email: string;

  admin: boolean;

  @Exclude()
  verified: boolean;

  @Exclude()
  passwordHash: string;
}
