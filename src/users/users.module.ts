import { Controller, Get, Post, Put, Delete, Body, Param, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() { return this.repo.find({ relations: ['memberships', 'memberships.project'] }); }
  findOne(id: string) { return this.repo.findOne({ where: { id }, relations: ['memberships', 'memberships.project', 'tasks'] }); }
  create(dto: Partial<User>) { return this.repo.save(this.repo.create(dto)); }
  update(id: string, dto: Partial<User>) { return this.repo.save({ ...dto, id }); }
  remove(id: string) { return this.repo.delete(id); }
}

@Controller('users')
export class UsersController {
  constructor(private svc: UsersService) {}
  @Get() findAll() { return this.svc.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post() create(@Body() dto: Partial<User>) { return this.svc.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: Partial<User>) { return this.svc.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
