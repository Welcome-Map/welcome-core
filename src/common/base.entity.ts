import { Exclude } from 'class-transformer';

export abstract class BaseEntity {
  id?: string;

  @Exclude()
  createDateTime?: Date;

  @Exclude()
  lastChangedDateTime?: Date;
}
