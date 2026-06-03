"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsController = exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let ProjectsService = class ProjectsService {
    constructor(repo, memberRepo, auditRepo) {
        this.repo = repo;
        this.memberRepo = memberRepo;
        this.auditRepo = auditRepo;
    }
    findAll() {
        return this.repo.find({ relations: ['members', 'members.user', 'sprints'] });
    }
    findOne(id) {
        return this.repo.findOne({ where: { id }, relations: ['members', 'members.user', 'sprints', 'sprints.tasks', 'credentials', 'docs'] });
    }
    async create(dto) {
        const project = await this.repo.save(this.repo.create(dto));
        await this.auditRepo.save(this.auditRepo.create({ action: 'CREATE', entityType: 'Project', entityId: project.id, projectId: project.id, details: `Project "${project.name}" created` }));
        return project;
    }
    async update(id, dto) {
        const project = await this.repo.save({ ...dto, id });
        await this.auditRepo.save(this.auditRepo.create({ action: 'UPDATE', entityType: 'Project', entityId: id, projectId: id, details: `Project updated` }));
        return project;
    }
    async remove(id) {
        await this.auditRepo.save(this.auditRepo.create({ action: 'DELETE', entityType: 'Project', entityId: id, details: `Project deleted` }));
        return this.repo.delete(id);
    }
    getMembers(projectId) {
        return this.memberRepo.find({ where: { projectId }, relations: ['user'] });
    }
    addMember(projectId, dto) {
        return this.memberRepo.save(this.memberRepo.create({ projectId, ...dto }));
    }
    removeMember(projectId, userId) {
        return this.memberRepo.delete({ projectId, userId });
    }
    async getStats(id) {
        const project = await this.repo.findOne({ where: { id }, relations: ['sprints', 'sprints.tasks'] });
        if (!project)
            return null;
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
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.ProjectMember)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProjectsService);
let ProjectsController = class ProjectsController {
    constructor(svc) {
        this.svc = svc;
    }
    findAll() { return this.svc.findAll(); }
    findOne(id) { return this.svc.findOne(id); }
    create(dto) { return this.svc.create(dto); }
    update(id, dto) { return this.svc.update(id, dto); }
    remove(id) { return this.svc.remove(id); }
    getMembers(id) { return this.svc.getMembers(id); }
    addMember(id, dto) { return this.svc.addMember(id, dto); }
    removeMember(id, userId) { return this.svc.removeMember(id, userId); }
    getStats(id) { return this.svc.getStats(id); }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/members'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(':id/members/:userId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getStats", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, common_1.Controller)('projects'),
    __metadata("design:paramtypes", [ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.module.js.map