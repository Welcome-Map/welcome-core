import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { OrgsMembershipsService } from './orgs-memberships.service';

@Controller('organisations')
export class OrgsMembershipsController {
  constructor(private orgsMembershipsService: OrgsMembershipsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async join(
    @Param('id') id: string,
    @Request() req,
    @Body() user: { userId: string; role: Role },
  ) {
    const res = await this.orgsMembershipsService.create({
      id,
      userId: user.userId,
      role: user.role,
    });
    return res;
  }
}
