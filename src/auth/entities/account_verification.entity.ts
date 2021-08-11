import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';

export class AccountVerification extends BaseEntity {
  code: string;

  user: User;
}
