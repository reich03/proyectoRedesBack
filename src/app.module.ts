import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Project, ProjectMember, Sprint, Task, Credential, Doc, AuditLog } from './entities';

import { UsersController, UsersService } from './users/users.module';
import { ProjectsController, ProjectsService } from './projects/projects.module';
import { SprintsController, SprintsService } from './sprints/sprints.module';
import { TasksController, TasksService } from './tasks/tasks.module';
import { CredentialsController, CredentialsService } from './credentials/credentials.module';
import { DocsController, DocsService } from './docs/docs.module';
import { AuditController, AuditService } from './audit/audit.module';

const entities = [User, Project, ProjectMember, Sprint, Task, Credential, Doc, AuditLog];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: '/data/projectflow.db',
      entities,
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [UsersController, ProjectsController, SprintsController, TasksController, CredentialsController, DocsController, AuditController],
  providers: [UsersService, ProjectsService, SprintsService, TasksService, CredentialsService, DocsService, AuditService],
})
export class AppModule {}
