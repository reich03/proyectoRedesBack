import { Controller, Get, Post, Put, Delete, Body, Param, Query, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doc } from '../entities';

@Injectable()
export class DocsService {
  constructor(@InjectRepository(Doc) private repo: Repository<Doc>) {}
  findByProject(projectId: string) { return this.repo.find({ where: { projectId }, order: { updatedAt: 'DESC' } }); }
  findOne(id: string) { return this.repo.findOne({ where: { id } }); }
  create(dto: Partial<Doc>) { return this.repo.save(this.repo.create(dto)); }
  update(id: string, dto: Partial<Doc>) { return this.repo.save({ ...dto, id }); }
  remove(id: string) { return this.repo.delete(id); }
}

@Controller('docs')
export class DocsController {
  constructor(private svc: DocsService) {}
  @Get() findByProject(@Query('projectId') projectId: string) { return this.svc.findByProject(projectId); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post() create(@Body() dto: Partial<Doc>) { return this.svc.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: Partial<Doc>) { return this.svc.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
