import { Controller, Get, Post, Put, Delete, Body, Param, Query, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sprint, Task, AuditLog } from '../entities';

@Injectable()
export class SprintsService {
  constructor(
    @InjectRepository(Sprint) private repo: Repository<Sprint>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(AuditLog) private auditRepo: Repository<AuditLog>,
  ) {}

  findByProject(projectId: string) {
    return this.repo.find({ where: { projectId }, relations: ['tasks', 'tasks.assignee'], order: { createdAt: 'ASC' } });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['tasks', 'tasks.assignee'] });
  }

  async create(dto: Partial<Sprint>) {
    const sprint = await this.repo.save(this.repo.create(dto));
    await this.auditRepo.save(this.auditRepo.create({ action: 'CREATE', entityType: 'Sprint', entityId: sprint.id, projectId: sprint.projectId, details: `Sprint "${sprint.name}" created` }));
    return sprint;
  }

  async update(id: string, dto: Partial<Sprint>) {
    const old = await this.repo.findOne({ where: { id } });
    const sprint = await this.repo.save({ ...dto, id });
    if (old && dto.status && old.status !== dto.status) {
      await this.auditRepo.save(this.auditRepo.create({ action: 'STATUS_CHANGE', entityType: 'Sprint', entityId: id, projectId: sprint.projectId, details: `Sprint "${sprint.name}" moved from ${old.status} to ${dto.status}` }));
    }
    return sprint;
  }

  remove(id: string) { return this.repo.delete(id); }

  async getDayByDay(id: string) {
    const sprint = await this.repo.findOne({ where: { id }, relations: ['tasks'] });
    if (!sprint || !sprint.startDate || !sprint.endDate) return [];
    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);
    const days = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayStr = d.toISOString().split('T')[0];
      const tasks = sprint.tasks || [];
      const doneTasks = tasks.filter(t => t.status === 'done');
      days.push({ date: dayStr, total: tasks.length, done: doneTasks.length, inProgress: tasks.filter(t => t.status === 'in_progress').length, todo: tasks.filter(t => t.status === 'todo').length });
    }
    return days;
  }
}

@Controller('sprints')
export class SprintsController {
  constructor(private svc: SprintsService) {}
  @Get() findByProject(@Query('projectId') projectId: string) { return this.svc.findByProject(projectId); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post() create(@Body() dto: Partial<Sprint>) { return this.svc.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: Partial<Sprint>) { return this.svc.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
  @Get(':id/timeline') getDayByDay(@Param('id') id: string) { return this.svc.getDayByDay(id); }
}
