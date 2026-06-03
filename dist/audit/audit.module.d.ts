import { Repository } from 'typeorm';
import { AuditLog } from '../entities';
export declare class AuditService {
    private repo;
    constructor(repo: Repository<AuditLog>);
    findByProject(projectId: string): Promise<AuditLog[]>;
    findAll(): Promise<AuditLog[]>;
}
export declare class AuditController {
    private svc;
    constructor(svc: AuditService);
    findLogs(projectId: string): Promise<AuditLog[]>;
}
