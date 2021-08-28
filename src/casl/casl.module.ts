import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CaslOrgsAbilityFactory } from './casl-orgs-ability.factory';

@Module({
  providers: [CaslOrgsAbilityFactory, PrismaService],
  exports: [CaslOrgsAbilityFactory],
})
export class CaslModule {}
