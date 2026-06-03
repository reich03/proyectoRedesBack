import { Repository } from 'typeorm';
import { Sprint, Task, AuditLog } from '../entities';
export declare class SprintsService {
    private repo;
    private taskRepo;
    private auditRepo;
    constructor(repo: Repository<Sprint>, taskRepo: Repository<Task>, auditRepo: Repository<AuditLog>);
    findByProject(projectId: string): Promise<Sprint[]>;
    findOne(id: string): Promise<Sprint>;
    create(dto: Partial<Sprint>): Promise<Sprint>;
    update(id: string, dto: Partial<Sprint>): Promise<{
        id: string;
        name?: string;
        goal?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
        project?: import("../entities").Project;
        projectId?: string;
        createdAt?: Date;
        tasks?: Task[];
    } & Sprint>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    getDayByDay(id: string): Promise<any[]>;
}
export declare class SprintsController {
    private svc;
    constructor(svc: SprintsService);
    findByProject(projectId: string): Promise<Sprint[]>;
    findOne(id: string): Promise<Sprint>;
    create(dto: Partial<Sprint>): Promise<Sprint>;
    update(id: string, dto: Partial<Sprint>): Promise<{
        id: string;
        name?: string;
        goal?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
        project?: import("../entities").Project;
        projectId?: string;
        createdAt?: Date;
        tasks?: Task[];
    } & Sprint>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    getDayByDay(id: string): Promise<any[]>;
}
