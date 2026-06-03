import { Repository } from 'typeorm';
import { Project, ProjectMember, AuditLog } from '../entities';
export declare class ProjectsService {
    private repo;
    private memberRepo;
    private auditRepo;
    constructor(repo: Repository<Project>, memberRepo: Repository<ProjectMember>, auditRepo: Repository<AuditLog>);
    findAll(): Promise<Project[]>;
    findOne(id: string): Promise<Project>;
    create(dto: Partial<Project>): Promise<Project>;
    update(id: string, dto: Partial<Project>): Promise<{
        id: string;
        name?: string;
        description?: string;
        status?: string;
        color?: string;
        createdAt?: Date;
        updatedAt?: Date;
        members?: ProjectMember[];
        sprints?: import("../entities").Sprint[];
        credentials?: import("../entities").Credential[];
        docs?: import("../entities").Doc[];
        auditLogs?: AuditLog[];
    } & Project>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    getMembers(projectId: string): Promise<ProjectMember[]>;
    addMember(projectId: string, dto: {
        userId: string;
        role: string;
    }): Promise<ProjectMember>;
    removeMember(projectId: string, userId: string): Promise<import("typeorm").DeleteResult>;
    getStats(id: string): Promise<{
        totalSprints: number;
        totalTasks: number;
        doneTasks: number;
        overallSuccess: number;
        sprints: {
            id: string;
            name: string;
            status: string;
            total: number;
            done: number;
            successRate: number;
        }[];
    }>;
}
export declare class ProjectsController {
    private svc;
    constructor(svc: ProjectsService);
    findAll(): Promise<Project[]>;
    findOne(id: string): Promise<Project>;
    create(dto: Partial<Project>): Promise<Project>;
    update(id: string, dto: Partial<Project>): Promise<{
        id: string;
        name?: string;
        description?: string;
        status?: string;
        color?: string;
        createdAt?: Date;
        updatedAt?: Date;
        members?: ProjectMember[];
        sprints?: import("../entities").Sprint[];
        credentials?: import("../entities").Credential[];
        docs?: import("../entities").Doc[];
        auditLogs?: AuditLog[];
    } & Project>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    getMembers(id: string): Promise<ProjectMember[]>;
    addMember(id: string, dto: {
        userId: string;
        role: string;
    }): Promise<ProjectMember>;
    removeMember(id: string, userId: string): Promise<import("typeorm").DeleteResult>;
    getStats(id: string): Promise<{
        totalSprints: number;
        totalTasks: number;
        doneTasks: number;
        overallSuccess: number;
        sprints: {
            id: string;
            name: string;
            status: string;
            total: number;
            done: number;
            successRate: number;
        }[];
    }>;
}
