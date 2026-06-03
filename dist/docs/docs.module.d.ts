import { Repository } from 'typeorm';
import { Doc } from '../entities';
export declare class DocsService {
    private repo;
    constructor(repo: Repository<Doc>);
    findByProject(projectId: string): Promise<Doc[]>;
    findOne(id: string): Promise<Doc>;
    create(dto: Partial<Doc>): Promise<Doc>;
    update(id: string, dto: Partial<Doc>): Promise<{
        id: string;
        title?: string;
        content?: string;
        category?: string;
        project?: import("../entities").Project;
        projectId?: string;
        createdAt?: Date;
        updatedAt?: Date;
    } & Doc>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
export declare class DocsController {
    private svc;
    constructor(svc: DocsService);
    findByProject(projectId: string): Promise<Doc[]>;
    findOne(id: string): Promise<Doc>;
    create(dto: Partial<Doc>): Promise<Doc>;
    update(id: string, dto: Partial<Doc>): Promise<{
        id: string;
        title?: string;
        content?: string;
        category?: string;
        project?: import("../entities").Project;
        projectId?: string;
        createdAt?: Date;
        updatedAt?: Date;
    } & Doc>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
