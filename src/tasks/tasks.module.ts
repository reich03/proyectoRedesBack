import { Controller, Get, Post, Put, Delete, Body, Param, Query, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, AuditLog } from '../entities';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private repo: Repository<Task>,
    @InjectRepository(AuditLog) private auditRepo: Repository<AuditLog>,
  ) {}

  findBySprint(sprintId: string) {
    return this.repo.find({ where: { sprintId }, relations: ['assignee'], order: { order: 'ASC' } });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['assignee', 'sprint'] });
  }

  async create(dto: Partial<Task>) {
    const task = await this.repo.save(this.repo.create(dto));
    await this.auditRepo.save(this.auditRepo.create({ action: 'CREATE', entityType: 'Task', entityId: task.id, projectId: null, details: `Task "${task.title}" created` }));
    return task;
  }

  async update(id: string, dto: Partial<Task>) {
    const old = await this.repo.findOne({ where: { id } });
    const task = await this.repo.save({ ...dto, id });
    if (old && dto.status && old.status !== dto.status) {
      await this.auditRepo.save(this.auditRepo.create({ action: 'STATUS_CHANGE', entityType: 'Task', entityId: id, details: `Task "${task.title}" moved from ${old.status} to ${dto.status}` }));
    }
    return task;
  }

  async reorder(updates: { id: string; status: string; order: number }[]) {
    const saved = [];
    for (const u of updates) {
      const task = await this.repo.findOne({ where: { id: u.id } });
      if (task) {
        task.status = u.status;
        task.order = u.order;
        saved.push(await this.repo.save(task));
      }
    }
    return saved;
  }

  remove(id: string) { return this.repo.delete(id); }
}

@Controller('tasks')
export class TasksController {
  constructor(private svc: TasksService) {}
  @Get() findBySprint(@Query('sprintId') sprintId: string) { return this.svc.findBySprint(sprintId); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post() create(@Body() dto: Partial<Task>) { return this.svc.create(dto); }
  @Put('reorder') reorder(@Body() updates: { id: string; status: string; order: number }[]) { return this.svc.reorder(updates); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: Partial<Task>) { return this.svc.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
