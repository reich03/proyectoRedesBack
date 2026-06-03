import { Controller, Get, Query, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities';

@Injectable()
export class AuditService {
  constructor(@InjectRepository(AuditLog) private repo: Repository<AuditLog>) {}

  findByProject(projectId: string) {
    return this.repo.find({ where: { projectId }, relations: ['user'], order: { createdAt: 'DESC' }, take: 100 });
  }

  findAll() {
    return this.repo.find({ relations: ['user', 'project'], order: { createdAt: 'DESC' }, take: 200 });
  }
}

@Controller('audit')
export class AuditController {
  constructor(private svc: AuditService) {}
  @Get() findLogs(@Query('projectId') projectId: string) {
    return projectId ? this.svc.findByProject(projectId) : this.svc.findAll();
  }
}
