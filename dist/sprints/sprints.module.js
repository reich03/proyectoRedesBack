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
exports.SprintsController = exports.SprintsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let SprintsService = class SprintsService {
    constructor(repo, taskRepo, auditRepo) {
        this.repo = repo;
        this.taskRepo = taskRepo;
        this.auditRepo = auditRepo;
    }
    findByProject(projectId) {
        return this.repo.find({ where: { projectId }, relations: ['tasks', 'tasks.assignee'], order: { createdAt: 'ASC' } });
    }
    findOne(id) {
        return this.repo.findOne({ where: { id }, relations: ['tasks', 'tasks.assignee'] });
    }
    async create(dto) {
        const sprint = await this.repo.save(this.repo.create(dto));
        await this.auditRepo.save(this.auditRepo.create({ action: 'CREATE', entityType: 'Sprint', entityId: sprint.id, projectId: sprint.projectId, details: `Sprint "${sprint.name}" created` }));
        return sprint;
    }
    async update(id, dto) {
        const old = await this.repo.findOne({ where: { id } });
        const sprint = await this.repo.save({ ...dto, id });
        if (old && dto.status && old.status !== dto.status) {
            await this.auditRepo.save(this.auditRepo.create({ action: 'STATUS_CHANGE', entityType: 'Sprint', entityId: id, projectId: sprint.projectId, details: `Sprint "${sprint.name}" moved from ${old.status} to ${dto.status}` }));
        }
        return sprint;
    }
    remove(id) { return this.repo.delete(id); }
    async getDayByDay(id) {
        const sprint = await this.repo.findOne({ where: { id }, relations: ['tasks'] });
        if (!sprint || !sprint.startDate || !sprint.endDate)
            return [];
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
};
exports.SprintsService = SprintsService;
exports.SprintsService = SprintsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Sprint)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Task)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SprintsService);
let SprintsController = class SprintsController {
    constructor(svc) {
        this.svc = svc;
    }
    findByProject(projectId) { return this.svc.findByProject(projectId); }
    findOne(id) { return this.svc.findOne(id); }
    create(dto) { return this.svc.create(dto); }
    update(id, dto) { return this.svc.update(id, dto); }
    remove(id) { return this.svc.remove(id); }
    getDayByDay(id) { return this.svc.getDayByDay(id); }
};
exports.SprintsController = SprintsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SprintsController.prototype, "findByProject", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SprintsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SprintsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SprintsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SprintsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/timeline'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SprintsController.prototype, "getDayByDay", null);
exports.SprintsController = SprintsController = __decorate([
    (0, common_1.Controller)('sprints'),
    __metadata("design:paramtypes", [SprintsService])
], SprintsController);
//# sourceMappingURL=sprints.module.js.map