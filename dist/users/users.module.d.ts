import { Repository } from 'typeorm';
import { User } from '../entities';
export declare class UsersService {
    private repo;
    constructor(repo: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    create(dto: Partial<User>): Promise<User>;
    update(id: string, dto: Partial<User>): Promise<{
        id: string;
        name?: string;
        email?: string;
        role?: string;
        avatar?: string;
        createdAt?: Date;
        memberships?: import("../entities").ProjectMember[];
        tasks?: import("../entities").Task[];
        auditLogs?: import("../entities").AuditLog[];
    } & User>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
export declare class UsersController {
    private svc;
    constructor(svc: UsersService);
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    create(dto: Partial<User>): Promise<User>;
    update(id: string, dto: Partial<User>): Promise<{
        id: string;
        name?: string;
        email?: string;
        role?: string;
        avatar?: string;
        createdAt?: Date;
        memberships?: import("../entities").ProjectMember[];
        tasks?: import("../entities").Task[];
        auditLogs?: import("../entities").AuditLog[];
    } & User>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
