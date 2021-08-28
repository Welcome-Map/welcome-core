import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  Put,
  Param,
} from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { createOrganisationDTO } from './dto/createOrganisation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateOrganisationDTO } from './dto/updateOrganisation.dto';

@Controller('organisations')
export class OrganisationsController {
  constructor(private organisationsService: OrganisationsService) {}

  @Get()
  async findAll(@Query() { take, skip }) {
    return this.organisationsService.findAll(take, skip);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createOrganisationParams: createOrganisationDTO,
    @Request() req,
  ) {
    return this.organisationsService.create(createOrganisationParams, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateOrganisationsDTO: UpdateOrganisationDTO,
  ) {
    return this.organisationsService.update(
      id,
      req.user,
      updateOrganisationsDTO,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.organisationsService.findOne({ id });
  }
}
