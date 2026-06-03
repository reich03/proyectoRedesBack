import { Repository } from 'typeorm';
import { Credential } from '../entities';
export declare class CredentialsService {
    private repo;
    constructor(repo: Repository<Credential>);
    findByProject(projectId: string): Promise<Credential[]>;
    findOne(id: string): Promise<Credential>;
    create(dto: Partial<Credential>): Promise<Credential>;
    update(id: string, dto: Partial<Credential>): Promise<{
        id: string;
        label?: string;
        type?: string;
        environment?: string;
        value?: string;
        notes?: string;
        project?: import("../entities").Project;
        projectId?: string;
        createdAt?: Date;
        updatedAt?: Date;
    } & Credential>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
export declare class CredentialsController {
    private svc;
    constructor(svc: CredentialsService);
    findByProject(projectId: string): Promise<Credential[]>;
    findOne(id: string): Promise<Credential>;
    create(dto: Partial<Credential>): Promise<Credential>;
    update(id: string, dto: Partial<Credential>): Promise<{
        id: string;
        label?: string;
        type?: string;
        environment?: string;
        value?: string;
        notes?: string;
        project?: import("../entities").Project;
        projectId?: string;
        createdAt?: Date;
        updatedAt?: Date;
    } & Credential>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
