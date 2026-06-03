import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ unique: true }) email: string;
  @Column({ default: 'member' }) role: string;
  @Column({ nullable: true }) avatar: string;
  @CreateDateColumn() createdAt: Date;
  @OneToMany(() => ProjectMember, m => m.user) memberships: ProjectMember[];
  @OneToMany(() => Task, t => t.assignee) tasks: Task[];
  @OneToMany(() => AuditLog, a => a.user) auditLogs: AuditLog[];
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ nullable: true }) description: string;
  @Column({ default: 'active' }) status: string;
  @Column({ nullable: true }) color: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @OneToMany(() => ProjectMember, m => m.project) members: ProjectMember[];
  @OneToMany(() => Sprint, s => s.project) sprints: Sprint[];
  @OneToMany(() => Credential, c => c.project) credentials: Credential[];
  @OneToMany(() => Doc, d => d.project) docs: Doc[];
  @OneToMany(() => AuditLog, a => a.project) auditLogs: AuditLog[];
}

@Entity('project_members')
export class ProjectMember {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Project, p => p.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;
  @Column() projectId: string;
  @ManyToOne(() => User, u => u.memberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column() userId: string;
  @Column({ default: 'dev' }) role: string;
  @CreateDateColumn() joinedAt: Date;
}

@Entity('sprints')
export class Sprint {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ nullable: true }) goal: string;
  @Column({ default: 'planning' }) status: string;
  @Column({ type: 'date', nullable: true }) startDate: string;
  @Column({ type: 'date', nullable: true }) endDate: string;
  @ManyToOne(() => Project, p => p.sprints, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;
  @Column() projectId: string;
  @CreateDateColumn() createdAt: Date;
  @OneToMany(() => Task, t => t.sprint) tasks: Task[];
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() title: string;
  @Column({ nullable: true }) description: string;
  @Column({ default: 'todo' }) status: string;
  @Column({ default: 'medium' }) priority: string;
  @Column({ default: 0 }) order: number;
  @Column({ type: 'date', nullable: true }) dueDate: string;
  @Column({ nullable: true }) storyPoints: number;
  @ManyToOne(() => Sprint, s => s.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sprintId' })
  sprint: Sprint;
  @Column() sprintId: string;
  @ManyToOne(() => User, u => u.tasks, { nullable: true })
  @JoinColumn({ name: 'assigneeId' })
  assignee: User;
  @Column({ nullable: true }) assigneeId: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}

@Entity('credentials')
export class Credential {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() label: string;
  @Column({ default: 'env' }) type: string;
  @Column({ nullable: true }) environment: string;
  @Column({ type: 'text' }) value: string;
  @Column({ nullable: true }) notes: string;
  @ManyToOne(() => Project, p => p.credentials, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;
  @Column() projectId: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}

@Entity('docs')
export class Doc {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() title: string;
  @Column({ type: 'text', nullable: true }) content: string;
  @Column({ nullable: true }) category: string;
  @ManyToOne(() => Project, p => p.docs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;
  @Column() projectId: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() action: string;
  @Column() entityType: string;
  @Column({ nullable: true }) entityId: string;
  @Column({ type: 'text', nullable: true }) details: string;
  @ManyToOne(() => Project, p => p.auditLogs, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'projectId' })
  project: Project;
  @Column({ nullable: true }) projectId: string;
  @ManyToOne(() => User, u => u.auditLogs, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column({ nullable: true }) userId: string;
  @CreateDateColumn() createdAt: Date;
}
