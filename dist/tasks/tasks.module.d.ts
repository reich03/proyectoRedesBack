import { Repository } from 'typeorm';
import { Task, AuditLog } from '../entities';
export declare class TasksService {
    private repo;
    private auditRepo;
    constructor(repo: Repository<Task>, auditRepo: Repository<AuditLog>);
    findBySprint(sprintId: string): Promise<Task[]>;
    findOne(id: string): Promise<Task>;
    create(dto: Partial<Task>): Promise<Task>;
    update(id: string, dto: Partial<Task>): Promise<{
        id: string;
        title?: string;
        description?: string;
        status?: string;
        priority?: string;
        order?: number;
        dueDate?: string;
        storyPoints?: number;
        sprint?: import("../entities").Sprint;
        sprintId?: string;
        assignee?: import("../entities").User;
        assigneeId?: string;
        createdAt?: Date;
        updatedAt?: Date;
    } & Task>;
    reorder(updates: {
        id: string;
        status: string;
        order: number;
    }[]): Promise<any[]>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
export declare class TasksController {
    private svc;
    constructor(svc: TasksService);
    findBySprint(sprintId: string): Promise<Task[]>;
    findOne(id: string): Promise<Task>;
    create(dto: Partial<Task>): Promise<Task>;
    reorder(updates: {
        id: string;
        status: string;
        order: number;
    }[]): Promise<any[]>;
    update(id: string, dto: Partial<Task>): Promise<{
        id: string;
        title?: string;
        description?: string;
        status?: string;
        priority?: string;
        order?: number;
        dueDate?: string;
        storyPoints?: number;
        sprint?: import("../entities").Sprint;
        sprintId?: string;
        assignee?: import("../entities").User;
        assigneeId?: string;
        createdAt?: Date;
        updatedAt?: Date;
    } & Task>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
