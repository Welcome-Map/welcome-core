import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CaslAbilityFactory } from './casl-ability.factory';

@Module({
  providers: [CaslAbilityFactory, PrismaService],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
