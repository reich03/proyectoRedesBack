import { Controller, Get, Post, Put, Delete, Body, Param, Query, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credential } from '../entities';

@Injectable()
export class CredentialsService {
  constructor(@InjectRepository(Credential) private repo: Repository<Credential>) {}
  findByProject(projectId: string) { return this.repo.find({ where: { projectId }, order: { environment: 'ASC' } }); }
  findOne(id: string) { return this.repo.findOne({ where: { id } }); }
  create(dto: Partial<Credential>) { return this.repo.save(this.repo.create(dto)); }
  update(id: string, dto: Partial<Credential>) { return this.repo.save({ ...dto, id }); }
  remove(id: string) { return this.repo.delete(id); }
}

@Controller('credentials')
export class CredentialsController {
  constructor(private svc: CredentialsService) {}
  @Get() findByProject(@Query('projectId') projectId: string) { return this.svc.findByProject(projectId); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post() create(@Body() dto: Partial<Credential>) { return this.svc.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: Partial<Credential>) { return this.svc.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
