"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./entities");
const users_module_1 = require("./users/users.module");
const projects_module_1 = require("./projects/projects.module");
const sprints_module_1 = require("./sprints/sprints.module");
const tasks_module_1 = require("./tasks/tasks.module");
const credentials_module_1 = require("./credentials/credentials.module");
const docs_module_1 = require("./docs/docs.module");
const audit_module_1 = require("./audit/audit.module");
const entities = [entities_1.User, entities_1.Project, entities_1.ProjectMember, entities_1.Sprint, entities_1.Task, entities_1.Credential, entities_1.Doc, entities_1.AuditLog];
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'better-sqlite3',
                database: '/data/projectflow.db',
                entities,
                synchronize: true,
                logging: false,
            }),
            typeorm_1.TypeOrmModule.forFeature(entities),
        ],
        controllers: [users_module_1.UsersController, projects_module_1.ProjectsController, sprints_module_1.SprintsController, tasks_module_1.TasksController, credentials_module_1.CredentialsController, docs_module_1.DocsController, audit_module_1.AuditController],
        providers: [users_module_1.UsersService, projects_module_1.ProjectsService, sprints_module_1.SprintsService, tasks_module_1.TasksService, credentials_module_1.CredentialsService, docs_module_1.DocsService, audit_module_1.AuditService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map