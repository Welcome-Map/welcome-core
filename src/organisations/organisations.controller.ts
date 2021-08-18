import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
} from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { createOrganisationDTO } from './dto/createOrganisation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('organisations')
export class OrganisationsController {
  constructor(private organisationsService: OrganisationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createOrganisationParams: createOrganisationDTO,
    @Request() req,
  ) {
    return this.organisationsService.create(createOrganisationParams, req.user);
  }

  @Get()
  async findAll(@Query() { take, skip }) {
    return this.organisationsService.findAll(take, skip);
  }
}
