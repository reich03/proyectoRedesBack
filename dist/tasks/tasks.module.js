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
exports.TasksController = exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let TasksService = class TasksService {
    constructor(repo, auditRepo) {
        this.repo = repo;
        this.auditRepo = auditRepo;
    }
    findBySprint(sprintId) {
        return this.repo.find({ where: { sprintId }, relations: ['assignee'], order: { order: 'ASC' } });
    }
    findOne(id) {
        return this.repo.findOne({ where: { id }, relations: ['assignee', 'sprint'] });
    }
    async create(dto) {
        const task = await this.repo.save(this.repo.create(dto));
        await this.auditRepo.save(this.auditRepo.create({ action: 'CREATE', entityType: 'Task', entityId: task.id, projectId: null, details: `Task "${task.title}" created` }));
        return task;
    }
    async update(id, dto) {
        const old = await this.repo.findOne({ where: { id } });
        const task = await this.repo.save({ ...dto, id });
        if (old && dto.status && old.status !== dto.status) {
            await this.auditRepo.save(this.auditRepo.create({ action: 'STATUS_CHANGE', entityType: 'Task', entityId: id, details: `Task "${task.title}" moved from ${old.status} to ${dto.status}` }));
        }
        return task;
    }
    async reorder(updates) {
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
    remove(id) { return this.repo.delete(id); }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TasksService);
let TasksController = class TasksController {
    constructor(svc) {
        this.svc = svc;
    }
    findBySprint(sprintId) { return this.svc.findBySprint(sprintId); }
    findOne(id) { return this.svc.findOne(id); }
    create(dto) { return this.svc.create(dto); }
    reorder(updates) { return this.svc.reorder(updates); }
    update(id, dto) { return this.svc.update(id, dto); }
    remove(id) { return this.svc.remove(id); }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('sprintId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findBySprint", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('reorder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "reorder", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "remove", null);
exports.TasksController = TasksController = __decorate([
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [TasksService])
], TasksController);
//# sourceMappingURL=tasks.module.js.map