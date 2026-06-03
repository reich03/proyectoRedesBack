import { Controller, Get, Post, Put, Delete, Body, Param, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectMember, AuditLog } from '../entities';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private repo: Repository<Project>,
    @InjectRepository(ProjectMember) private memberRepo: Repository<ProjectMember>,
    @InjectRepository(AuditLog) private auditRepo: Repository<AuditLog>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['members', 'members.user', 'sprints'] });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['members', 'members.user', 'sprints', 'sprints.tasks', 'credentials', 'docs'] });
  }

  async create(dto: Partial<Project>) {
    const project = await this.repo.save(this.repo.create(dto));
    await this.auditRepo.save(this.auditRepo.create({ action: 'CREATE', entityType: 'Project', entityId: project.id, projectId: project.id, details: `Project "${project.name}" created` }));
    return project;
  }

  async update(id: string, dto: Partial<Project>) {
    const project = await this.repo.save({ ...dto, id });
    await this.auditRepo.save(this.auditRepo.create({ action: 'UPDATE', entityType: 'Project', entityId: id, projectId: id, details: `Project updated` }));
    return project;
  }

  async remove(id: string) {
    await this.auditRepo.save(this.auditRepo.create({ action: 'DELETE', entityType: 'Project', entityId: id, details: `Project deleted` }));
    return this.repo.delete(id);
  }

  getMembers(projectId: string) {
    return this.memberRepo.find({ where: { projectId }, relations: ['user'] });
  }

  addMember(projectId: string, dto: { userId: string; role: string }) {
    return this.memberRepo.save(this.memberRepo.create({ projectId, ...dto }));
  }

  removeMember(projectId: string, userId: string) {
    return this.memberRepo.delete({ projectId, userId });
  }

  async getStats(id: string) {
    const project = await this.repo.findOne({ where: { id }, relations: ['sprints', 'sprints.tasks'] });
    if (!project) return null;
    const sprints = project.sprints || [];
    const sprintStats = sprints.map(s => {
      const tasks = s.tasks || [];
      const done = tasks.filter(t => t.status === 'done').length;
      const total = tasks.length;
      return { id: s.id, name: s.name, status: s.status, total, done, successRate: total > 0 ? Math.round((done / total) * 100) : 0 };
    });
    const allTasks = sprints.flatMap(s => s.tasks || []);
    const totalDone = allTasks.filter(t => t.status === 'done').length;
    return {
      totalSprints: sprints.length,
      totalTasks: allTasks.length,
      doneTasks: totalDone,
      overallSuccess: allTasks.length > 0 ? Math.round((totalDone / allTasks.length) * 100) : 0,
      sprints: sprintStats,
    };
  }
}

@Controller('projects')
export class ProjectsController {
  constructor(private svc: ProjectsService) {}
  @Get() findAll() { return this.svc.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post() create(@Body() dto: Partial<Project>) { return this.svc.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: Partial<Project>) { return this.svc.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
  @Get(':id/members') getMembers(@Param('id') id: string) { return this.svc.getMembers(id); }
  @Post(':id/members') addMember(@Param('id') id: string, @Body() dto: { userId: string; role: string }) { return this.svc.addMember(id, dto); }
  @Delete(':id/members/:userId') removeMember(@Param('id') id: string, @Param('userId') userId: string) { return this.svc.removeMember(id, userId); }
  @Get(':id/stats') getStats(@Param('id') id: string) { return this.svc.getStats(id); }
}
