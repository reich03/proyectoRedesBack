export declare class User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
    createdAt: Date;
    memberships: ProjectMember[];
    tasks: Task[];
    auditLogs: AuditLog[];
}
export declare class Project {
    id: string;
    name: string;
    description: string;
    status: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
    members: ProjectMember[];
    sprints: Sprint[];
    credentials: Credential[];
    docs: Doc[];
    auditLogs: AuditLog[];
}
export declare class ProjectMember {
    id: string;
    project: Project;
    projectId: string;
    user: User;
    userId: string;
    role: string;
    joinedAt: Date;
}
export declare class Sprint {
    id: string;
    name: string;
    goal: string;
    status: string;
    startDate: string;
    endDate: string;
    project: Project;
    projectId: string;
    createdAt: Date;
    tasks: Task[];
}
export declare class Task {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    order: number;
    dueDate: string;
    storyPoints: number;
    sprint: Sprint;
    sprintId: string;
    assignee: User;
    assigneeId: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Credential {
    id: string;
    label: string;
    type: string;
    environment: string;
    value: string;
    notes: string;
    project: Project;
    projectId: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Doc {
    id: string;
    title: string;
    content: string;
    category: string;
    project: Project;
    projectId: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AuditLog {
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    details: string;
    project: Project;
    projectId: string;
    user: User;
    userId: string;
    createdAt: Date;
}
